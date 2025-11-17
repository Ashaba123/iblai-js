# ibl web mobile data layer

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md).

## Dev setup

When developing locally, you should use a local registry to publish the packages and iterate fast.

Run the following command to publish locally:

```bash
make publish-local
```

By default, we use verdaccio as the local registry.

Don't forge to setup the `.npmrc` file to use the local registry.

```bash
//localhost:4873/:_authToken=<token>
@iblai:registry=http://localhost:4873/
```
