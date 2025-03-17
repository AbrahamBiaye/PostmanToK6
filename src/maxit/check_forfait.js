import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from 'k6/data';

export let options = {
  vus: 1, // Nombre d'utilisateurs simultanés
  duration: "5s", // Durée du test
};

const token = new SharedArray('user token', function () {
  return JSON.parse(open('../../ressource/data/maxit/ressources.json')).tokens;
});
const appKey = new SharedArray('user appKey', function () {
  return JSON.parse(open('../../ressource/data/maxit/ressources.json')).appKeys;
});
const headersData = new SharedArray('user head data', function () {
  return JSON.parse(open('../../ressource/data/maxit/header.json')).headers;
});
const getHeaderUrl = new SharedArray('get Header url', function () {
  return JSON.parse(open('../../ressource/data/maxit/config.json')).urls;
});
const msisdn = new SharedArray('user number', function () {
  return JSON.parse(open('../../ressource/data/maxit/config.json')).msisdns;
});
const duid = new SharedArray('user duid', function () {
  return JSON.parse(open('../../ressource/data/maxit/config.json')).duids;
});
const pin = new SharedArray('user pin', function () {
  return JSON.parse(open('../../ressource/data/maxit/config.json')).pins;
});


export default function() {
  let url = `${getHeaderUrl[0].getHeader}/v1/mob/forfait/check-forfait/${msisdn}`;
  let headers = {
    Authorization: `Bearer ${token[0].tokenConnexion}`,
    __app_key__: appKey,
    ...headersData
  }

  let res = http.get(url, { headers });

  check(res, {
    "Statut 200 reçu": (r) => r.status === 200,
    "✅Réponse contient au moins un forfait": (r) => {
      try {
        let jsonResponse = JSON.parse(r.body);
        return jsonResponse.length >= 1;
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1);
}
