import 'dart:convert';
import 'dart:async';
import 'package:bluetooth_ecg/screens/schedule_appointments_screens/date_picker_screens.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class Doctor {
  final String id;
  final String accountId;
  final String username;
  final int gender;
  final int birth;
  final String phoneNumber;
  final String? image;
  final int statusId;
  final String information;
  final int roleId;

  Doctor({
    required this.id,
    required this.accountId,
    required this.username,
    required this.gender,
    required this.birth,
    required this.phoneNumber,
    this.image,
    required this.statusId,
    required this.information,
    required this.roleId,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['id'] as String,
      accountId: json['account_id'] as String,
      username: json['username'] as String,
      gender: json['gender'] as int,
      birth: json['birth'] as int,
      phoneNumber: json['phone_number'] as String,
      image: json['image'] as String?,
      statusId: json['status_id'] as int,
      information: json['information'] as String,
      roleId: json['role_id'] as int,
    );
  }
}

class DoctorListScreen extends StatefulWidget {
  const DoctorListScreen({super.key});

  @override
  State<DoctorListScreen> createState() => _DoctorListScreenState();
}

class _DoctorListScreenState extends State<DoctorListScreen> {
  late Future<List<Doctor>> _futureDoctors;
  List<Doctor> _allDoctors = [];
  List<Doctor> _filteredDoctors = [];
  String _searchText = '';

  @override
  void initState() {
    super.initState();
    _futureDoctors = fetcherDoctors();
  }

  void _openDatePicker(BuildContext context, String doctorId, String doctorName,
      String doctorDescription) {
    try {
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => DatePicker(
                  doctorId: doctorId,
                  doctorName: doctorName,
                  doctorDescription: doctorDescription)));
    } catch (e) {
      print('Error navigating: $e');
    }
  }

  Future<List<Doctor>> fetcherDoctors() async {
    try {
      final response = await http
          .get(Uri.parse('http://192.168.100.88:3000/users/doctors'), headers: {
        "Content-type": "application/json",
        "Authorization":
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI5ZGMzOGQ4OS01NWQxLTRkNDEtOGJmYi1jODg1YmM2ZmYwYmUiLCJyb2xlIjoxLCJpYXQiOjE3MzE2NjM1ODUsImV4cCI6MTczMTY2NDQ4NX0.hjGxBE0ZCO9aiW17espYgYYCBF-IVi0NhmY_L9eLC0632SaRtLpMWZTcTij1BSD0QP5N6z2jSeWoZWMsEeVYKIvquh-4m6jnfCtXhk9Xlsvky6Aq2Otk9FFqPjINOkfiGDdw-EGpiHrMcENRGMnPAHk200V_oW_YnBrQGzHOZvGIhQFyYEqTsAkyaMTK_OerYj6H9TGfxxclTx95Mfbh1avg-3s3-MUnznLqGUj3w7udLAzQ0BT_DtVT5Gh5ezpHwcBdBz9Tc02IOt2mbkLbJ02owOxCtI3UC7Et4PRIY7hLLNq0K9pS7ajplCdtIszhHQV55Uk4kp8Jvv1UZGvpLg"
      }).timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        List jsonResponse = json.decode(response.body);
        setState(() {
          _allDoctors =
              jsonResponse.map((doctor) => Doctor.fromJson(doctor)).toList();
          _filteredDoctors = _allDoctors;
        });
        return _filteredDoctors;
      } else {
        throw Exception('Failed to load doctors');
      }
    } catch (e) {
      throw Exception('Failed to load doctors: $e');
    }
  }

  void _filterDoctors(String searchText) {
    setState(() {
      _searchText = searchText.toLowerCase();
      _filteredDoctors = _allDoctors
          .where(
              (doctor) => doctor.username.toLowerCase().contains(_searchText))
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Doctor List',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {},
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                  labelText: 'Search by name',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  )),
              onChanged: (value) {
                _filterDoctors(value);
              },
            ),
          ),
          Expanded(
            child: FutureBuilder<List<Doctor>>(
              future: _futureDoctors,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('No doctors found'));
                } else {
                  return ListView.builder(
                    itemCount: _filteredDoctors.length,
                    itemBuilder: (context, index) {
                      final doctor = _filteredDoctors[index];
                      return InkWell(
                        onTap: () => _openDatePicker(context, doctor.id,
                            doctor.username, doctor.information),
                        child: Card(
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
                                  backgroundImage: AssetImage(
                                      'assets/images/doctor_image.png'),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        doctor.username,
                                        style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        doctor.information,
                                        style: const TextStyle(
                                            fontSize: 16, color: Colors.grey),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
