import 'package:bluetooth_ecg/screens/personal_infor_screens/listView_infor.dart';
import 'package:flutter/material.dart';

final List<Map<String, String>> listInfo = [
  {"title": "Họ và tên", "description": "Đồng Minh Thái"},
  {"title": "Số điện thoại", "description": "0967827856"},
  {
    "title": "Email",
    "description": "thai.dm279@gmail.com",
  }
];

final class PersonalInfor extends StatelessWidget {
  const PersonalInfor({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text(
            'Thông tin tài khoản',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          centerTitle: true,
        ),
        body: SingleChildScrollView(
          child: Column(
            children: [
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    children: [
                      Opacity(
                        opacity: 0.5,
                        child: Icon(
                          Icons.account_circle,
                          size: 90,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    children: [
                      Opacity(
                        opacity: 0.5,
                        child: Icon(
                          Icons.camera_enhance,
                          size: 30,
                        ),
                      ),
                      const SizedBox(
                        height: 8,
                      ),
                      const Text(
                        'Cài ảnh đại diện',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    children: [
                      Opacity(
                        opacity: 0.5,
                        child: const Icon(
                          Icons.qr_code,
                          size: 30,
                        ),
                      ),
                      const SizedBox(
                        height: 8,
                      ),
                      const Text('Mã Qr của tôi',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w400,
                          ))
                    ],
                  )
                ],
              ),
              const SizedBox(
                height: 8,
              ),
              ...listInfo.map((item) => ListViewInfo(
                    title: item['title']!,
                    description: item['description']!,
                  )),
              const SizedBox(
                height: 12,
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    const Text(
                      'Thông tin định danh',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    const Text(
                      'Chi tiết',
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.blue,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(
                height: 12,
              ),
              ListViewInfo(
                  title: "Trạng thái", description: "Định danh thành công"),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons
                          .security, 
                      size: 20,
                      color: Colors.green,
                    ),
                    const Text('Bảo mật tuyệt đối mọi thông tin của bạn',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w200,
                        )),
                  ],
                ),
              ),
              Align(
                alignment: Alignment.bottomCenter,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      primary: Colors.blue,
                    ),
                    child: const Text(
                      'Cập nhật lại định danh',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ));
  }
}
