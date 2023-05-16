rm -rf front-end/build/ back-end/public/
cd front-end/
yarn build
cp -r build/ ../back-end/public/
