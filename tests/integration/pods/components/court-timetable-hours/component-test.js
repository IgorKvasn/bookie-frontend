import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('court-timetable-hours', 'Integration | Component | court timetable hours', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{court-timetable-hours}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#court-timetable-hours}}
      template block text
    {{/court-timetable-hours}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
