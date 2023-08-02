import React, { ReactNode } from 'react';
import { Divider, Paper } from '@mantine/core';

interface IInboxView {
  leftComponent: ReactNode;
  rightComponent: ReactNode;
  dist?: number
}

const InboxView: React.FC<IInboxView> = ({ leftComponent, rightComponent, dist }) => {
    return (
      <Paper style={{ display: 'flex', width: '100%', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ margin: '10px', width: `${dist || 30}%`, boxSizing: 'border-box' }}>
            {leftComponent}
        </div>
        <Divider orientation="vertical" color='#EEEEEE' style={{background: "white"}} />
        <div style={{ margin: '10px', boxSizing: 'border-box' }}>
            {rightComponent}
        </div>
      </Paper>
    );
};

export default InboxView;
