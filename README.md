this plugin was originally made by [vazome](https://github.com/vazome/quartz-clickable-images-zoom-plugin) for Quartz4

i adapted this plugin for Quartz5

## Example Usage

https://github.com/user-attachments/assets/efa742b7-0aac-4fb8-8ed1-d1c7fd5caa36

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
