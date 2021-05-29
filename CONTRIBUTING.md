# Contributing

1. [Fork it](https://help.github.com/articles/fork-a-repo/)
2. Install dependencies (`npm i`)
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Added some feature'`)
5. Test your changes (`npm run t`)
6. Push to the branch (`git push origin my-new-feature`)
7. [Create new Pull Request](https://help.github.com/articles/creating-a-pull-request/)

## Testing

We use [Jest with Enzyme](https://jestjs.io/docs/en/getting-started) to write tests. Run our test suite with this command:

```
npm run t
```

## Code Style

We use [prettier](https://www.npmjs.com/package/prettier) and [eslint](https://www.npmjs.com/package/eslint) to maintain code style and best practices. Please make sure your PR adheres to the guides by running:

```
npm run l
```
