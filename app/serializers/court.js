import SpringSerializer from './abstract-spring-serializer';

export default SpringSerializer.extend({
	attrs: {
		'reservations': {
			embedded: 'always'
		}
	}
});
