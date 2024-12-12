import 'package:bluetooth_ecg/certs/secrets.dart';
import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'dart:convert';
import 'dart:async';
import 'package:http/http.dart' as http;

class DatePicker extends StatefulWidget {
  final String doctorId;
  final String doctorName;
  final String doctorDescription;
  const DatePicker(
      {super.key,
      required this.doctorId,
      required this.doctorName,
      required this.doctorDescription});

  @override
  State<DatePicker> createState() => _DatePickerState();
}

class _DatePickerState extends State<DatePicker> {
  DateTime _selectedDay = DateTime.now();
  DateTime _focusedDay = DateTime.now();
  late Future<List> _busyDay;

  void initState() {
    super.initState();
    _busyDay = fetcherDate();
  }

  Future<List<Map<String, dynamic>>> fetcherDate() async {
    try {
      final url = Uri.parse(
          'http://192.168.100.88:3000/schedules/doctor-id/${widget.doctorId}');

      final response = await http.get(
        url,
        headers: {
          "Authorization":
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI5ZGMzOGQ4OS01NWQxLTRkNDEtOGJmYi1jODg1YmM2ZmYwYmUiLCJyb2xlIjoxLCJpYXQiOjE3MzE2NjM1ODUsImV4cCI6MTczMTY2NDQ4NX0.hjGxBE0ZCO9aiW17espYgYYCBF-IVi0NhmY_L9eLC0632SaRtLpMWZTcTij1BSD0QP5N6z2jSeWoZWMsEeVYKIvquh-4m6jnfCtXhk9Xlsvky6Aq2Otk9FFqPjINOkfiGDdw-EGpiHrMcENRGMnPAHk200V_oW_YnBrQGzHOZvGIhQFyYEqTsAkyaMTK_OerYj6H9TGfxxclTx95Mfbh1avg-3s3-MUnznLqGUj3w7udLAzQ0BT_DtVT5Gh5ezpHwcBdBz9Tc02IOt2mbkLbJ02owOxCtI3UC7Et4PRIY7hLLNq0K9pS7ajplCdtIszhHQV55Uk4kp8Jvv1UZGvpLg",
          "Content-Type": "application/json",
        },
      ).timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        print("Request successful");
        List<dynamic> jsonData = json.decode(response.body);
        List<Map<String, dynamic>> formattedData =
            jsonData.map((item) => item as Map<String, dynamic>).toList();
        return formattedData;
      } else {
        print("Request failed with status: ${response.statusCode}");
        return [];
      }
    } catch (e) {
      throw Exception('Failed to load date of doctor: $e');
    }
  }

  Future _sendTimePicker(DateTime date, TimeOfDay time) async {
    final url = Uri.parse("http://192.168.100.88:3000/schedules/create/doctor");
    final body = {
      "doctor_id": widget.doctorId,
      "schedule_start_time":
          DateTime(date.year, date.month, date.day, time.hour, time.minute)
                  .millisecondsSinceEpoch ~/
              1000,
      "schedule_end_time":
          DateTime(date.year, date.month, date.day, time.hour, time.minute)
                  .add(const Duration(minutes: 30))
                  .millisecondsSinceEpoch ~/
              1000,
      "schedule_type_id": 1,
    };
    try {
      final response = await http.post(url,
          headers: {
            "Content-type": "application/json",
            "Authorization":
                "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI5ZGMzOGQ4OS01NWQxLTRkNDEtOGJmYi1jODg1YmM2ZmYwYmUiLCJyb2xlIjoxLCJpYXQiOjE3MzE2NjM1ODUsImV4cCI6MTczMTY2NDQ4NX0.hjGxBE0ZCO9aiW17espYgYYCBF-IVi0NhmY_L9eLC0632SaRtLpMWZTcTij1BSD0QP5N6z2jSeWoZWMsEeVYKIvquh-4m6jnfCtXhk9Xlsvky6Aq2Otk9FFqPjINOkfiGDdw-EGpiHrMcENRGMnPAHk200V_oW_YnBrQGzHOZvGIhQFyYEqTsAkyaMTK_OerYj6H9TGfxxclTx95Mfbh1avg-3s3-MUnznLqGUj3w7udLAzQ0BT_DtVT5Gh5ezpHwcBdBz9Tc02IOt2mbkLbJ02owOxCtI3UC7Et4PRIY7hLLNq0K9pS7ajplCdtIszhHQV55Uk4kp8Jvv1UZGvpLg"
          },
          body: jsonEncode(body));
      if (response.statusCode == 201) {
        _showSuccess(true);
      } else {
        print("Lỗi khi gửi lịch hẹn: ${response.statusCode}, ${response.body}");
        _showSuccess(false);
      }
    } catch (e) {
      throw Exception('Failed to post schedule: $e');
    }
  }

  void _showTimePicker() async {
    showModalBottomSheet(
        context: context,
        builder: (BuildContext context) {
          return TimePickerModal(
            selectedDate: _selectedDay,
            onTimeSelected: (selectedTime) {
              //Navigator.pop(context);
              Future.delayed(const Duration(milliseconds: 100), () {
                _confirmTime(selectedTime);
              });
            },
            busyDate: _busyDay,
          );
        });
  }

  void _confirmTime(final TimeOfDay selectedTime) async {
    print("Selected time: ${selectedTime.format(context)}");
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
              title: const Text('Xác nhận đặt lịch'),
              content: Text(
                  "Bạn có chắc chắn muốn đặt lịch vào ${selectedTime.format(context)} ${_selectedDay.day}-${_selectedDay.month}-${_selectedDay.year}?"),
              actions: <Widget>[
                TextButton(
                  child: const Text("Hủy"),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
                TextButton(
                  child: const Text("Đồng ý"),
                  onPressed: () {
                    Navigator.of(context).pop();
                    _sendTimePicker(_selectedDay, selectedTime);
                  },
                ),
              ]);
        });
  }

  void _showSuccess(bool isSuccess) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text(isSuccess ? 'Thành công' : 'Thất bại'),
            content: Text(
              isSuccess
                  ? 'Lịch hẹn của bạn đã được đặt thành công!'
                  : 'Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại.',
            ),
            actions: <Widget>[
              TextButton(
                child: const Text("OK"),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: const Text(
            'Date picker',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          centerTitle: true,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () {
              Navigator.pop(context);
            },
          )),
      body: Column(children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 6),
          child: TableCalendar(
            focusedDay: _focusedDay,
            firstDay: DateTime.utc(2024, 1, 1),
            lastDay: DateTime.utc(2025, 12, 31),
            selectedDayPredicate: (day) {
              return isSameDay(_selectedDay, day);
            },
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
              if (selectedDay
                  .isAfter(DateTime.now().subtract(const Duration(days: 1)))) {
                _showTimePicker();
              }
            },
            calendarStyle: const CalendarStyle(
                selectedDecoration:
                    BoxDecoration(color: Colors.blue, shape: BoxShape.circle),
                todayDecoration: BoxDecoration(
                    color: Colors.blueAccent, shape: BoxShape.circle)),
            headerStyle: const HeaderStyle(
              formatButtonVisible: false,
              titleCentered: true,
              leftChevronVisible: false,
              rightChevronVisible: false,
            ),
          ),
        ),
        const SizedBox(
          height: 8,
        ),
        Card(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 2,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const CircleAvatar(
                  radius: 40,
                  backgroundImage: AssetImage('assets/images/doctor_image.png'),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.doctorName,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        widget.doctorDescription,
                        style:
                            const TextStyle(fontSize: 16, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ]),
    );
  }
}

class TimePickerModal extends StatelessWidget {
  final DateTime selectedDate;
  final void Function(TimeOfDay) onTimeSelected;
  final Future<List> busyDate;

  const TimePickerModal({
    Key? key,
    required this.selectedDate,
    required this.onTimeSelected,
    required this.busyDate,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Padding(
          padding: EdgeInsets.all(8.0),
          child: Text(
            'Select a time',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 300,
          child: FutureBuilder<List>(
            future: busyDate,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(
                  child: Text("${snapshot.error}"),
                );
              } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                return const Center(
                  child: Text("Không có giờ bận nào."),
                );
              } else {
                List busyHours = snapshot.data!;
                return ListView.builder(
                  itemCount: 21,
                  itemBuilder: (context, index) {
                    final hour = 8 + index ~/ 2;
                    final minute = (index % 2) * 30;
                    final time = TimeOfDay(hour: hour, minute: minute);
                    final timeDate = DateTime(
                                selectedDate.year,
                                selectedDate.month,
                                selectedDate.day,
                                hour,
                                minute)
                            .millisecondsSinceEpoch ~/
                        1000;
                    final isBusy = busyHours
                        .any((item) => item['schedule_start_time'] == timeDate);
                    return ListTile(
                      title: Center(
                        child: Text(
                          time.format(context),
                          style: TextStyle(
                            color: isBusy ? Colors.red : Colors.black,
                          ),
                        ),
                      ),
                      onTap: isBusy
                          ? null
                          : () {
                              onTimeSelected(time);
                              Navigator.pop(context);
                            },
                    );
                  },
                );
              }
            },
          ),
        ),
      ],
    );
  }
}
