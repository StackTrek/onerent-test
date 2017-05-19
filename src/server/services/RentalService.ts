import { injectable, KeyValuePair } from 'chen/core';
import { Service } from 'chen/sql';
import { Rental } from 'app/models';

@injectable()
export class RentalService extends Service<Rental> {

  protected modelClass = Rental;

  public async getCount(filter: KeyValuePair<any>) {
    let data = await this.query(query => {
      query.select(this.db.connection().raw('COUNT(id) as id'))
      if (filter) {
        if (filter['max_rent']) {
          query.where('target_rent', '<', filter['max_rent']);
        }

        if (filter['min_rent']) {
          query.where('target_rent', '>', filter['min_rent']);
        }

        if (filter['beds']) {
          if (filter['beds'] != '5+') {
            query.where('bed_count', filter['beds']);
          } else {
            query.where('bed_count', '>=', 5);
          }
        }

        if (filter['bath']) {
          if (filter['bath'] != '5+') {
            query.where('bathroom_count', filter['bath']);
          } else {
            query.where('bathroom_count', '>=', 5);
          }
        }
      }
    }).get()

    return data.first().getId();
  }
}
