import React from 'react';

export const PageHeader = ({ title, subtitle, rightElement }) => (
  <div className="sticky top-0 z-10 bg-[#0B0A0A]/95 backdrop-blur-sm border-b border-[#2E2A27] px-4 py-4">
    <div className="max-w-2xl mx-auto flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[#F5EFE6]">{title}</h1>
        {subtitle && <p className="text-sm text-[#A79C8E]">{subtitle}</p>}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  </div>
);

export default PageHeader;
