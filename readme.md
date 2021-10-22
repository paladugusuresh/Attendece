<div>
<pre>
  <b>PreRequisites:</b>
  Node js: 12 or above
  Ionic Cli Version: 6.17.0
</pre>
 <pre>
   For running the ionic application:
        ionic serve
 </pre>
</div>
<div>
Below are the commands to install native storage to install native storage for ionic capacitor.
<pre>
  For installing any plugins: npm install cordova-plugin-nativestorage
                              npm install @ionic-native/native-storage
  For build and copying the files to specific platform: 
                              ionic cap sync (android/ios) or
                              npx cap sync (android/ios)
  For opening xcode:                            
            npx cap open ios
  Hot reloading in emulator:
     ionic capacitor run ios --livereload --external
  Resolving cocoapods issue for MAC:
    brew install cocoapods --build-from-source
    brew link --overwrite cocoapods
    brew upgrade cocoapods --> Not always required
    which pod returns /usr/local/bin/pod which is correct.
  Sometimes even after following above steps of cocoapods still we may face issue for fresh project setup using ionic cli then try to follow the below steps:
    1. Move the path to ios/App/ from root directory of project inside terminal(Give permissions to navigating path in MAC).
    2. Run the command "pod install".
  Signing Key alias name is focalpoint
  Key user name is FPAdmin@123.
</pre>
</div>