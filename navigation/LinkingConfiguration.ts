import * as Linking from 'expo-linking';

export default {
    prefixes: [Linking.makeUrl('/')],
    config: {
        screens: {
            Root: {
                screens: {
                    TabOne: {
                        screens: {
                            TabOneScreen: 'one',
                        },
                    },
                    TabTwo: {
                        screens: {
                            Profile: 'two',
                        },
                    },
                    Scanner: {
                        screens: {
                            Scanner: "scanner"
                        }
                    },
                    Registration: {
                        screens: {
                            Registration: "registration"
                        }
                    },
                    MyChat: {
                        screens: {
                            MyChat: "mychat"
                        }
                    }
                },
            },
            NotFound: '*',
        },
    },
};
