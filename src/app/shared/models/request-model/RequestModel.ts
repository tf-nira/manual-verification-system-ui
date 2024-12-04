import Utils from '../../../app.util';
import * as appConstanst from '../../../app.constants';

export class RequestModel {
  id: string = '';
  version: string = '';
  requesttime: string = '';
  metadata: any = {};
  request: any;

  constructor(request: any) {
    this.request = request; // Actual request payload
  }

}
