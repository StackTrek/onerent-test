import { Model, Collection, field, FieldTypes } from 'chen/sql';

export class Rental extends Model {

  protected table = 'rentals';
  protected collectionClass = RentalCollection;

  @field()
  public id: FieldTypes.Number;

  @field()
  public name: FieldTypes.String;

  @field()
  public description: FieldTypes.String;

  @field()
  public address: FieldTypes.String;

  @field()
  public city: FieldTypes.String;

  @field()
  public geoLocation: FieldTypes.String;

  @field()
  public type: FieldTypes.String;

  @field()
  public targetDeposit: FieldTypes.Number;

  @field()
  public targetRent: FieldTypes.Number;

  @field()
  public totalArea: FieldTypes.Number;

  @field()
  public minimumCreditStore: FieldTypes.Number;

  @field()
  public bathroomCount: FieldTypes.Number;

  @field()
  public bedCount: FieldTypes.Number;

  @field()
  public createdAt: FieldTypes.Date;

  @field()
  public updatedAt: FieldTypes.Date;
}

export class RentalCollection extends Collection<Rental> {

  protected modelClass = Rental;
}
