# frozen_string_literal: true

class Evaluation < ApplicationRecord
  # # Associations
  #
  belongs_to :employee

  has_many :sections, as: :sectionable, dependent: :destroy
  accepts_nested_attributes_for :sections

  # # Scopes
  #
  scope :by_state, proc { |state| where(state: state) if state.present? }

  # # Enums
  #
  enum state: { draft: 'draft', completed: 'completed', archived: 'archived' }

  # # Validations
  #
  validates :employee_id, uniqueness: {
    scope: :state,
    message: :draft_exists
  }, if: :draft?

  validates :state, inclusion: {
    in: Evaluation.states.keys,
    message: :invalid_inclusion
  }
end
