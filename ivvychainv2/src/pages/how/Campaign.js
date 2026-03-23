import React from 'react';

const Campaign = () => {
  const campaignQuestions = [
    "Campaign performance in terms of building Awareness, Lead generation, Inquiry generation and progression, Business closed",
    "Filling the Pipeline through Campaigns",
    "Inquiry metrics for each Campaign - Industry groups, Territories, Sales closure time etc",
    "special focus on Schemes"
  ];

  return (
    <div className="content-header" style={{ backgroundColor: '#ecf0f5', minHeight: 'calc(100vh - 50px)', padding: '20px' }}>
      {/* HOW Header */}
      <div className="box box-solid box-primary" style={{ marginBottom: '20px' }}>
        <div className="box-header" style={{ backgroundColor: '#3c8dbc', color: '#fff', padding: '10px 15px', borderBottom: '1px solid #367fa9' }}>
          <h3 className="box-title" style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            <i className="fa fa-question-circle mr-2"></i>
            HOW
          </h3>
          <div className="box-tools pull-right">
            <button className="btn btn-box-tool" data-widget="collapse" style={{ color: '#fff', background: 'transparent', border: 'none', padding: '5px' }}>
              <i className="fa fa-minus"></i>
            </button>
          </div>
        </div>
        <div className="box-body" style={{ padding: '15px' }}>
          {/* CAMPAIGNS Title */}
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
            Campaigns
          </h2>

          {/* Campaign Questions List */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {campaignQuestions.map((question, index) => (
              <li key={index} style={{ marginBottom: '12px', paddingLeft: '20px', position: 'relative', color: '#333', fontSize: '14px', lineHeight: '1.6' }}>
                <span style={{ position: 'absolute', left: '0', color: '#666' }}>•</span>
                {question}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
