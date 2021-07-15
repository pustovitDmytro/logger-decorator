export * from 'myrmidon';

export function mergeConfigs(...configs) {
    const config = {};

    for (const [ conf = {} ] of configs.reverse()) {
        for (const key of Object.keys(conf)) {
            config[key] = conf[key];
        }
    }

    return config;
}
