import visualizer from 'rollup-plugin-visualizer';
import { ANALYSIS } from '../../constant';

export function ConfigVisualizerConfig() {
    if (ANALYSIS) {
        return visualizer({
            filename: './dist/stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
        });
    }
    return [];
}
