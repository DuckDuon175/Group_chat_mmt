import 'dart:convert';
import 'dart:io';

import 'package:bluetooth_ecg/app.dart';
import 'package:bluetooth_ecg/constants/api_constant.dart';
import 'package:bluetooth_ecg/generated/l10n.dart';
import 'package:bluetooth_ecg/providers/bluetooth_provider.dart';
import 'package:bluetooth_ecg/providers/ecg_provider.dart';
import 'package:bluetooth_ecg/providers/news_provider.dart';
import 'package:bluetooth_ecg/providers/user_provider.dart';
import 'package:bluetooth_ecg/utils/utils.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:web_socket_channel/io.dart';
import 'firebase_options.dart';
import 'providers/auth_provider.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // If you're going to use other Firebase services in the background, such as Firestore,
  // make sure you call `initializeApp` before using other Firebase services.
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  print("Handling a background message: ${message.notification?.body}");
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  await FirebaseMessaging.instance.getInitialMessage();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  String topic = "message:122222";
  final wsUrl = Uri.parse(APIConstant.socketUrl);
  final channel = IOWebSocketChannel.connect(wsUrl);
  final Map<String, dynamic> joinMessage = {
    'topic': topic,
    'event': 'phx_join',
    'payload': {
      "accessToken": "1234",
    },
    'ref': ''
  };
  await channel.ready;

  channel.sink.add(json.encode(joinMessage));
  channel.stream.listen((message) {
      print('okeee:$message');
    },
    onDone: () {
      print("nani done");
    },
    onError: (err) => print("errsocket: $err")
  );
  print("WebSocket is connected at ${DateTime.now()}");

  if (Platform.isAndroid) {
    WidgetsFlutterBinding.ensureInitialized();
    [
      Permission.location,
      Permission.storage,
      Permission.bluetooth,
      Permission.bluetoothConnect,
      Permission.bluetoothScan
    ].request().then((status) {
      runApp(const FmECGApp());
    });
  } else {
    runApp(const FmECGApp());
  }
}

class FmECGApp extends StatefulWidget {
  const FmECGApp({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return FmECGAppState();
  }
}

class FmECGAppState extends State<FmECGApp> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => NewsProvider()),
        ChangeNotifierProvider(create: (_) => BluetoothProvider()),
        ChangeNotifierProvider(create: (_) => ECGProvider()),
      ],
      child: Consumer<AuthProvider>(builder: (ctx, auth, _) {
        Utils.globalContext = ctx;
        return const MaterialApp(
          debugShowCheckedModeBanner: false,
          // theme: (auth.theme == ThemeType.dark
          //         ? ThemeECG.darkTheme
          //         : ThemeECG.lightTheme)
          //     .copyWith(
          //         pageTransitionsTheme: const PageTransitionsTheme(
          //   builders: <TargetPlatform, PageTransitionsBuilder>{
          //     TargetPlatform.android: ZoomPageTransitionsBuilder(),
          //   },
          // )),
          // darkTheme: ThemeECG.darkTheme,
          //home: const MainScreen(),
          home: App(),
          //const Login1Screen(),
          // auth.isAuth
          //     ? const MainScreen()
          //     :
          // FutureBuilder(
          //     future: auth.isAuth,
          //     builder: (context, snapshot) {
          //       if (snapshot.connectionState == ConnectionState.waiting) {
          //         return const CircularProgressIndicator();
          //       }

          // return FutureBuilder(
          //     future: auth.checkAutoLogin(),
          //     builder: (ctx, authResultSnapshot) {
          //       if (authResultSnapshot.connectionState ==
          //           ConnectionState.waiting) {
          //         return const CircularProgressIndicator();
          //       } else if (authResultSnapshot.hasError) {
          //         return Text('Error: ${authResultSnapshot.error}');
          //       } else {
          //         return const Login1Screen();
          //       }
          //     });
          //   else if (snapshot.hasError) {
          //     return Text('Error: ${snapshot.error}');
          //   } else if (snapshot.hasData && snapshot.data == true) {
          //     return const MainScreen();
          //   } else {
          //     return const Login1Screen();
          //   }
          // }),
          localizationsDelegates: [
            S.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
        );
      }),
    );
  }
}
