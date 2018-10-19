import { Model, Collection } from 'vue-mc'

// Validation rules
import { required, string } from 'vue-mc/validation'


/**
 * Evaluation model
 */
class Evaluation extends Model {

  // Default attributes that define the "empty" state.
  defaults() {
    return {
      id: null,
      state: 'draft',
      sections_attributes: []
    }
  }

  routes() {
    return {
      save: '/v1/evaluations',
      fetch: '/v1/evaluations/{id}'
    }
  }

}

export { Evaluation }
