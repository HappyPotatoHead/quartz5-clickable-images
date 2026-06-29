this plugin was originally made by [vazome](https://github.com/vazome/quartz-clickable-images-zoom-plugin) for Quartz4

i adapted this plugin for Quartz5

<video width="320" height="240" controls>
  <source src="assets/example.mp4" type="video/mp4">
</video>

<!-- ![](assets/example.mp4) -->

## Installation and Usage

- install the plugin
  - `npx quartz plugin add github:HappyPotatoHead/quartz5-clickable-images`
- go to `quartz.config.yaml`

```yaml
plugins:
    - source: github:HappyPotatoHead/quartz5-clickable-images
    enabled: true
    # options...
```

- to update
  - `npx quartz plugin install --latest github:HappyPotatoHead/quartz5-clickable-images`

### Available options:

1. minScaleFactor - number;
2. maxScaleFactor - number;
3. borderRadius - string;

## Future

i'll probably introduce modularity (move css and js out of `transformer.ts`), but the plugin works as is

anyway, enjoy!
