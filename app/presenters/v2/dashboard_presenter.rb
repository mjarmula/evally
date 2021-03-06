# frozen_string_literal: true

module V2
  class DashboardPresenter
    delegate :setting, to: :@user

    def initialize(user)
      @user = user
    end

    def employees
      V2::DashboardUpcomingQuery.call(employees_scope)
                                .order(next_evaluation_on: :desc)
                                .limit(setting.default_upcoming_items || 5)
    end

    def drafts
      drafts_scope.includes(:employee)
                  .order(updated_at: :desc)
                  .limit(setting.default_draft_items || 5)
    end

    def activities
      activities_scope.includes(:user).order(created_at: :desc).limit(5)
    end

    def templates
      Template.includes(:creator).order(name: :asc)
    end

    private

    def activities_scope
      Pundit.policy_scope!(@user, [:v2, Activity])
    end

    def employees_scope
      Pundit.policy_scope!(@user, [:v2, Employee])
    end

    def drafts_scope
      Pundit.policy_scope!(@user, [:v2, Evaluation]).draft
    end
  end
end
