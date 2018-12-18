const BSWP = require('browser-sync-webpack-plugin');
const bs = require('browser-sync');

// bs({
//     host: 'localhost',
//     port: 3010,
//     server: {
//         baseDir: [__dirname+'/dist']
//     },
//     watch: false
// });

module.exports = {
    devServer: {
        contentBase: __dirname+'/dist',
        compress: true,
        port: 3010
    },
    entry: {
        main: './src/main.ts',
    },
    devtool: 'inline-source-map',
    // plugins: [
    //     new BSWP({
    //         host: 'localhost',
    //         port: 3010,
    //         server: {
    //             baseDir: [__dirname+'/dist']
    //         },
    //         watch: false
    //     })
    // ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },

            {
                test: /\.(jpe?g|gif|png|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images/'
                }
            },

            {
                test: /\.(wav|mp3)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'audio/'
                }
            },

            {
                test: /\.html$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: '/'
                }
            },
        
            {
                test: /\.css$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'css/'
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    optimization: {
        minimize: false
    },
    output: {
        filename: '[name].js',
        path: __dirname+'/dist'
    }
};