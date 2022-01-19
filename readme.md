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
<pre>
  Permissions required for below plugins to work
  Android: (android/app/src/main/AndroidManifest.xml)
   1. <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />
  2.  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  IOS: (ios/App/App/Info.plist)
  1. <key>NSCameraUsageDescription</key>
	   <string>To capture images</string>
	   <key>NSPhotoLibraryAddUsageDescription</key>
	   <string>To add images</string>
	   <key>NSPhotoLibraryUsageDescription</key>
	   <string>To store images</string>
  2. <key>NSLocationAlwaysUsageDescription</key>
     <string>To get the geolocation of the user for attendance marking.</string>
     <key>NSLocationWhenInUseUsageDescription</key>
     <string>To get the geolocation of the user for attendance marking.</string>
</pre>
<pre>
  App Icon/Splash Screen Generation:
  1. Cordova-res cli need to install in the machine
     npm install cordova-res -g
  2. cordova-res pulls the icon/splash image from resources folder
      Resource folder
      -android
        --icon-foregroung.png(432*432 => 288*288 center image + remaining area with white border).
      -icon.png(1024*1024)
      -splash.png(2732*2732)
  3. Add below build script in package.json (Only for the first time)
      "resources": "cordova-res ios --skip-config --copy && cordova-res android --skip-config --copy --icon-background-source '#FFFFFF'"
  4. Use the below urls for resizing or adding white border space to images
       Resizing: https://www.iloveimg.com/resize-image#resize-options,pixels
       Adding white border: https://www5.lunapic.com/editor/?action=border
</pre>
</div>