(function () {
  angular
    .module('pms')
    .controller('LoginController', LoginController);

  // 로그인 컨트롤러
  function LoginController($log, $window, $sessionStorage, $document, $http, $state, SHA256) {
    const vm = this;
    vm.log = $log.log;

    vm.login = () => {
      // 백엔드에 인증 시도
      $http.post('/rest/login', {
        uid: vm.uid,
        pw: vm.pw
      }).then((result) => {
        if (result.data.result) {
          $window.location.assign('/main');
        } else if (vm.uid == null) alert('아이디를 입력해주세요.');
        else alert('아이디 또는 비밀번호를 다시 확인해주세요.');
        console.log('Login Error');

        $sessionStorage.putObject('session', result.data);
      });
    };

    /* vm.login = () => {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.uid, vm.pw, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.uid, vm.pw);
                    $location.path('/main');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                    console.log("Error")
                }
            });
        }; */


    const input = $document[0].getElementById('password_input');

    if (input != null) {
      input.onkeyup = function (e) {
        if (e.keyCode === 13) { vm.login(); }
      };
    }

    vm.logout = () => {
      $sessionStorage.remove('session');
      $http.get('/rest/logout').then(() => {
        $state.go('/login');
      });
    };

    vm.register = () => {
      $http.post('/rest/user', {
        name: vm.name,
        uid: vm.uid,
        pw: vm.pw,
        email: vm.email,
        ph: vm.ph
      });
      $window.location.assign('/login');
    };
  }
}());
