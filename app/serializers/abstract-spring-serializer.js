import DS from 'ember-data';
import Ember from 'ember';

/**
 * Spring MVC potrebuje dostavat JSON bez roota - takze ho musime odstranit
 */
export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {

	serializeIntoHash: function (hash, type, record, options) {
		var serialized = this.serialize(record, options);

		//serializovany model nema v sebe ID, tkze je treba ho pridat takymto manualnym sposobom + kvoli Jacksonu (v pripade, ze sa pouziva sideloading na save)
		serialized.id = record.id ? record.id : '';

		//remove the root element
		Ember.assign(hash, serialized);
	}
});
