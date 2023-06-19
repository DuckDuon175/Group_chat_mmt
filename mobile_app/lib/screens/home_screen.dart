import 'package:bluetooth_ecg/screens/bluetooth_screens/bluetooth_off_screen.dart';
import 'package:bluetooth_ecg/screens/bluetooth_screens/bluetooth_scanning_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {

    // String deviceUUID = "00001800-0000-1000-8000-00805f9b34fb";
    // String deviceID = "D6:88:7F:DA:2B:09";
    return StreamBuilder<BluetoothState>(
      stream: FlutterBluePlus.instance.state,
      initialData: BluetoothState.unknown,
      builder: (c, snapshot) {
        final state = snapshot.data;
        if (state == BluetoothState.on) {
          return BluetoothScanningScreen();
        }
        return BluetoothOffScreen(state: state);
      });
  }
}