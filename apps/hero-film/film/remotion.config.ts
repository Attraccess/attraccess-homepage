import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setPixelFormat('yuv420p');
Config.setConcurrency(6);
Config.setChromiumOpenGlRenderer('angle');
