# Treble Launchpad

## Deployments

- Production: [https://%PROJECT_NAME%.3kit.com](https://%PROJECT_NAME%.3kit.com)
- Development: [https://%PROJECT_NAME%.dev.3kit.com](https://%PROJECT_NAME%.dev.3kit.com)
- Staging: [https://%PROJECT_NAME%.staging.3kit.com](https://%PROJECT_NAME%.staging.3kit.com)

Deployments are managed by Github actions tied to the repository and are triggered by a push event on the various branches.

Pushing to the `prod` branch will trigger the production deployment pipeline with the updated code. By default it will use the **admin-fts** environment on Threekit.

Pushing to the `dev` or `staging` branches will trigger the development deployment pipeline with the updated code. By default it will use the **preview** environment on Threekit.

## Embedding your Threekit App

To embed the hosted App in any existing web-page or eCommerce setup we will need to add two things into the HTML content of that page. The set of HTML elements we want to embed out UI into and the script tag to request our React UI bundle.

**Set of HTML Elements**

Most often we embedding our App into a single HTML div, which only requires us to add that one div into the HTML page we plan to embed into. By default we expect this single div to have the id **`tk-treble-root`**, as specified in the `public/index.html` file and `src/index.js` file. However, this can be changed as per project needs.

```html
<div id="tk-treble-root"></div>
```

If our App is being embedded across multiple HTML containers, e.g. one for the player and another for the form, we add a div for each of them and ensure that the id given matches what our UI expects.

**Embed Script**

We add a script tag to request our built React app bundle from our production server. The bundle is located at `/threekit-embed.js`.

```html
<script src="https://%PROJECT_NAME%.3kit.com/threekit-embed.js"></script>
```

To embed one of our development environments we have to update the URL accordingly:

```html
<script src="https://%PROJECT_NAME%.dev.3kit.com/threekit-embed.js"></script>
```

**Example - Embed Snippet**

```html
<body id="tk-treble-app">
  <div id="tk-treble-root"></div>
  <div id="tk-treble-form"></div>
  <script src="https://%PROJECT_NAME%.3kit.com/threekit-embed.js"></script>
</body>
```
