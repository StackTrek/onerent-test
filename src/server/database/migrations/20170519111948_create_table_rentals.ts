import { knex } from 'chen/sql';

/**
 * Apply database schema changes
 * @param {knex} db
 */
export async function up(db: knex) {
  await db.schema.createTable('rentals', table => {
    table.increments();
    table.string('name').notNullable();
    table.text('description');
    table.string('image');
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.text('geo_location');
    table.boolean('dogs_allowed');
    table.boolean('cats_allowed');
    table.boolean('instant_viewing');
    table.enum('type', ['house', 'apartment']).defaultTo('house');
    table.integer('target_deposit');
    table.integer('target_rent');
    table.integer('total_area');
    table.integer('minimum_credit_store');
    table.integer('bathroom_count');
    table.integer('bed_count');

    table.timestamps();
  });
}

/**
 * Rollback database schema changes
 * @param {knex} db
 */
export async function down(db: knex) {
  await db.schema.dropTable('rentals');
}
