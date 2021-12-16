# install dependencies 
yarn

# install pods
cd ios && pod install && cd ..

# run packager
yarn start

# Xcode
open gitHubRNative.xcworkspace from /ios

# Detox
 - yarn detox-build:ios
 - yarn detox-test:ios