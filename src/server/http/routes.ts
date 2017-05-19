import { Router } from 'chen/web';
import { Config } from 'chen/core';

export default function (router: Router, config: Config) {

  router.route('GET', '/rentals', 'IndexController@getRentals');
  router.route('GET', '/', 'IndexController@index');
}
