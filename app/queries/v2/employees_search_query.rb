# frozen_string_literal: true

module V2
  class EmployeesSearchQuery
    def initialize(params)
      @params = params
    end

    def call
      Employee.select(fields).joins(tables).where(
        "#{group_condition} AND #{skill_name_condition} AND #{skill_value_condition}"
      ).distinct
    end

    private

    def fields
      [
        'employees.*',
        'latest_evaluation_join.*',
        'sections_join.section_id',
        'sections_join.section_name',
        'sections_join.section_group',
        'skills_join.skill'
      ].join(', ')
    end

    def tables # rubocop:disable Metrics/MethodLength
      "
        INNER JOIN LATERAL (
          SELECT
            id AS latest_evaluation_id,
            completed_at AS latest_evaluation_date
          FROM
            evaluations
          WHERE
            employee_id = employees.id AND state = 'completed'
          ORDER BY completed_at DESC
          LIMIT 1
        ) latest_evaluation_join ON true

        INNER JOIN LATERAL(
          SELECT
            id AS section_id,
            name AS section_name,
            \"group\" AS section_group,
            skills AS section_skills
          FROM sections
          WHERE
            sectionable_type = 'Evaluation' AND
              sectionable_id = latest_evaluation_join.latest_evaluation_id
        ) sections_join ON true

        LEFT JOIN LATERAL (
          SELECT
            value AS skill
          FROM
            jsonb_array_elements(sections_join.section_skills)
        ) skills_join ON true
      "
    end

    def group_condition
      ActiveRecord::Base.sanitize_sql(
        ['sections_join.section_group = ?', @params[:group]]
      )
    end

    def skill_name_condition
      ActiveRecord::Base.sanitize_sql(
        ["(skills_join.skill->>'name')::varchar = ?", @params[:name]]
      )
    end

    def skill_value_condition
      sql = "(skills_join.skill->>'value')::#{resolve_type} #{resolve_operator} ?"

      ActiveRecord::Base.sanitize_sql([sql, @params[:value]])
    end

    def resolve_operator
      { eq: '=', gt: '>', lt: '<' }.fetch(@params[:operator].to_sym, '=')
    end

    def resolve_type
      { bool: 'boolean', rating: 'integer' }.fetch(@params[:group].to_sym, 'integer')
    end
  end
end
