import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sapphirus.edisonlearning.attendance',
  appName: 'ELAttendance',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    splashScreen: {
      androidScaleType: 'CENTER_CROP',
      launchAutoHide: false
    }
  }
};

export default config;
