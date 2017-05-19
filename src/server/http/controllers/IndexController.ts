import { Controller, Request, Response } from 'chen/web';
import { injectable } from 'chen/core';
import { RentalService } from 'app/services';

@injectable()
export class IndexController extends Controller {

  constructor(private rentalService: RentalService) {
    super();
  }

  public async index(request: Request, response: Response) {
    return response.render('index');
  }

  public async getRentals(request: Request, response: Response) {
    let data = request.input.all();

    let count = await this.rentalService.getCount(data);

    let rentals = await this.rentalService.query(query => {

      if (data) {
        if (data['max_rent']) {
          query.where('target_rent', '<', data['max_rent']);
        }

        if (data['min_rent']) {
          query.where('target_rent', '>', data['min_rent']);
        }

        if (data['beds']) {
          if (data['beds'] != '5+') {
            query.where('bed_count', data['beds']);
          } else {
            query.where('bed_count', '>=', 5);
          }
        }

        if (data['bath']) {
          if (data['bath'] != '5+') {
            query.where('bathroom_count', data['bath']);
          } else {
            query.where('bathroom_count', '>=', 5);
          }
        }

        if (data['page'] && data['page'] > 1) {
          query.offset(20 * (data['page'] - 1));
        }
      }

      query.limit(20);
    }).get();


    return response.json({ data: rentals, count, pageCount: Math.floor(count / 20) });
  }
}
