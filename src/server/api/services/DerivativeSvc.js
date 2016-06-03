
import BaseSvc from './BaseSvc'
import request from 'request'
import trim from 'trim'
import util from 'util'

export default class DerivativeSvc extends BaseSvc {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor(opts) {

    super(opts);
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  name() {

    return 'DerivativeSvc';
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  get jobBuilder() {

    return {

      svf: (opts = {}) => {

        return {
          destination: {
            region: opts.region || 'us'
          },
          formats: [{
            type: 'svf',
            views: opts.views || ['2d', '3d']
          }]
        }
      },

      obj: (opts) => {

        return {
          destination: {
            region: opts.region || 'us'
          },
          formats: [{
            type: 'obj',
            advanced: {
              modelGuid: opts.guid,
              objectIds: opts.objectIds
            }
          }]
        }

      }
    }
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  postJob (token, urn, output) {

    return requestAsync({
      url: this._config.endPoints.job,
      method: "POST",
      token: token,
      json: true,
      body: {
        input: {
          urn: urn
      },
      output: output
      }
    });
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  getMetadata (token, urn) {

    var url = util.format(
      this._config.endPoints.metadata,
      urn);

    return requestAsync({
      url: url,
      token: token
    });
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  getHierarchy (token, urn, guid) {

    var url = util.format(
      this._config.endPoints.hierarchy,
      urn, guid);

    return requestAsync({
      url: url,
      token: token
    });
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  getManifest (token, urn) {

    var url = util.format(
      this._config.endPoints.manifest,
      urn);

    return requestAsync({
      url: url,
      token: token
    });
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  download (token, urn, derivativeURN) {

    var url = util.format(
      this._config.endPoints.download,
      urn, encodeURIComponent(derivativeURN));

    console.log(url)

    return requestAsync({
      url: url,
      token: token
    });
  }
}

/////////////////////////////////////////////////////////////////
// Utils
//
/////////////////////////////////////////////////////////////////
function requestAsync(params) {

  return new Promise( function(resolve, reject) {

    request({
      url: params.url,
      method: params.method || 'GET',
      headers: {
        'Authorization': 'Bearer ' + params.token,
        'Content-Type': 'application/json; charset=utf-8',
        'x-ads-acm-namespace': 'WIPDMSTG',
        'x-ads-acm-check-groups': true
      },
      json: true,
      body: params.body
    }, function (err, response, body) {

      try {

        if (err) {

          console.log('error: ' + params.url)
          console.log(err)

          return reject(err);
        }

        if (body.errors) {

          console.log('body error: ' + params.url)
          console.log(body.errors)

          return reject(body.errors);
        }

        return resolve(body.data || body);
      }
      catch(ex){

        console.log(params.url)
        console.log(body)

        return reject(ex);
      }
    })
  })
}