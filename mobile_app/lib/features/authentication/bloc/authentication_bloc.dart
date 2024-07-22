import 'dart:convert';

import 'package:bloc/bloc.dart';
import 'package:bluetooth_ecg/features/authentication/bloc/authentication_event.dart';
import 'package:bluetooth_ecg/features/authentication/bloc/authentication_state.dart';
import 'package:bluetooth_ecg/features/authentication/repository/authentication_repo.dart';
import 'package:bluetooth_ecg/features/authentication/repository/shared_pref_repo.dart';
import 'package:bluetooth_ecg/providers/user_provider.dart';
import 'package:bluetooth_ecg/utils/utils.dart';
import 'package:provider/provider.dart';

class AuthenticationBloc extends Bloc<AuthenticationEvent, AuthenticationState> {
  AuthenticationBloc({required this.authRepository}) : super(AuthenticationInitial()) {
    on<LogInRequest>(_onLoginRequest);
    on<LogoutRequest>(_onLogoutRequest);
    on<CheckAutoLogin>(_onCheckAutoLogin);
  }
  final AuthRepository authRepository;
  void _onLoginRequest(LogInRequest event, Emitter emit) async {
    try {
      final Map? response = await authRepository.loginUser(event.email, event.password);
      if (response == null) {
        emit(AuthenticationFail());
        return;
      }
      final Map dataUser = response["metadata"];
      SharedPreprerencesRepo.setDataUser(dataUser);
      Provider.of<UserProvider>(Utils.globalContext!, listen: false).setDataUser(dataUser);
      emit(AuthenticationSuccess());
    } catch (e) {
      emit(AuthenticationFail());
    }
  }

  void _onLogoutRequest(LogoutRequest event, Emitter emit) async {
    try {
      SharedPreprerencesRepo.removeDataUser();
      emit(AuthenticationFail());
    } catch (e) {
      emit(AuthenticationFail());
    }
  }
  void _onCheckAutoLogin(CheckAutoLogin event, Emitter emit) async {
    try {
      final bool hasLoggedIn = await SharedPreprerencesRepo.checkAutoLogin();
      if (hasLoggedIn) {
        final String dataLoginString = await SharedPreprerencesRepo.getDataUser();
        final Map dataLoginDecoded = jsonDecode(dataLoginString);
        Provider.of<UserProvider>(Utils.globalContext!, listen: false).setDataUser(dataLoginDecoded);
        emit(AuthenticationSuccess());
      } else {
        emit(AuthenticationInitial());
      }
    } catch (e, t) {
      print('dgndfgj:$e $t');
      emit(AuthenticationFail());
    }
  }
}
