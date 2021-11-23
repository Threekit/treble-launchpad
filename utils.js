const axios = require("axios");
const FormData = require("form-data");
const {
  THREEKIT_ENV,
  ORG_ID,
  AUTH_TOKEN,
  THUMBNAIL_KEY,
} = require("./constants");

const getImageUrl = (fileId) =>
  `https://${THREEKIT_ENV}/api/files/${fileId}/content`;

const prepComposites = (hookData) => {
  return hookData.tasks.reduce((output, task) => {
    const attrName = Object.keys(task.parameters.configuration).find(
      (key) => key !== "Pricing"
    );
    if (attrName) {
      const assetId = task.parameters.configuration[attrName].assetId;
      const imageId = task.runs[0].results.files[0].id;
      output[assetId] = getImageUrl(imageId);
    }
    return output;
  }, {});
};

const getCatalog = async () => {
  const url = `https://${THREEKIT_ENV}/api/products/export/json?orgId=${ORG_ID}&bearer_token=${AUTH_TOKEN}`;
  const response = await axios.get(url);
  return response.data;
};

const postCatalog = async (catalog) => {
  const url = `https://${THREEKIT_ENV}/api/products/import?orgId=${ORG_ID}`;
  const form = new FormData();
  form.append("file", Buffer.from(JSON.stringify(catalog)), {
    filename: "products-upload.json",
  });
  const response = await axios.post(url, form, {
    headers: {
      authorization: `Bearer ${AUTH_TOKEN}`,
      "content-type": `multipart/form-data; boundary=${form._boundary}`,
    },
  });

  return response.data;
};

module.exports.updateCatalogThumbnails = async (hooksData) => {
  const composites = prepComposites(hooksData);
  const catalog = await getCatalog();
  const assetsToUpdate = Object.keys(composites);
  const filtered = catalog.filter((el) => assetsToUpdate.includes(el.query.id));
  const updated = filtered.map((el) => {
    const output = el;
    let addedThumbnail = false;
    output.product.metadata = output.product.metadata.map((metadata) => {
      if (metadata.name === THUMBNAIL_KEY) {
        addedThumbnail = true;
        return Object.assign({}, metadata, {
          defaultValue: composites[el.query.id],
        });
      } else return metadata;
    });

    if (!addedThumbnail)
      output.product.metadata.push({
        type: "String",
        name: THUMBNAIL_KEY,
        blacklist: [],
        values: [],
        defaultValue: composites[el.query.id],
      });
    return output;
  });
  const response = await postCatalog(updated);
  return response;
};
