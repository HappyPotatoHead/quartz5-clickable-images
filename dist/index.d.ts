import { QuartzTransformerPlugin } from '@quartz-community/types';
export { QuartzTransformerPlugin } from '@quartz-community/types';

interface Options {
    minScaleFactor?: number;
    maxScaleFactor?: number;
    borderRadius?: string;
}

declare const ClickableImages: QuartzTransformerPlugin<Options>;

export { ClickableImages, type Options as ClickableImagesOptions };
