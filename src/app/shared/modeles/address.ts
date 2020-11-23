/* Address model
 * Detailed info http://guides.spreecommerce.org/developer/addresses.html
 * Public API's http://guides.spreecommerce.org/api/addresses.html
 */

export class Address {
  id: string;
  prenom: string;
  nom: string;
  adresse: string;
  ville: string;
  region: string;
  telephone: string;
  idPays: string;
  libellePays: string;
  pays: string;
  indicatif: string;
  constructor(
    prenom: string,
  nom: string,
  adresse: string,
  ville: string,
  region: string,
  telephone: string,
  idPays: string,
  libellePays: string,
  pays: string,
  indicatif: string
  ){}
}
