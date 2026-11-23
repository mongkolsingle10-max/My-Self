#!/usr/bin/env ruby
# frozen_string_literal: true

# Securely check for changed posts without shell command injection
require 'open3'

Jekyll::Hooks.register :posts, :post_init do |post|
  next unless post.path && File.exist?(post.path)

  begin
    commit_num_str, status = Open3.capture2('git', 'rev-list', '--count', 'HEAD', '--', post.path.to_s)
    if status.success? && commit_num_str.strip.to_i > 1
      lastmod_date, log_status = Open3.capture2('git', 'log', '-1', '--pretty=%ad', '--date=iso', '--', post.path.to_s)
      post.data['last_modified_at'] = lastmod_date.strip if log_status.success?
    end
  rescue StandardError
    # Skip git hook gracefully if git is unavailable
  end
end
