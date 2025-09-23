export enum AppScreen {
  LOGINSCREEN = 'Login',
  REGISTERSCREEN = 'Register',
  FORGOTPASSWORDSCREEN = 'ForgotPassword',
  LAYOUTSCREEN = 'Layout',
  HOMESCREEN = 'Home',
  DETAILSSCREEN = 'Details',
  SETTINGSSCREEN = 'Settings',
  PROFILESCREEN = 'Profile',
}

export type RootStackParamList = {
  [AppScreen.LAYOUTSCREEN]: {
    name: string | null;
    email: string;
    photo: string | null;
  };
  [AppScreen.REGISTERSCREEN]: undefined;
  [AppScreen.FORGOTPASSWORDSCREEN]: undefined;
  [AppScreen.PROFILESCREEN]: undefined;
};

export const AppVersion = {
  APPNAME: 'Swiftant-Timesheet',
  APPVERSION: '1.0',
}