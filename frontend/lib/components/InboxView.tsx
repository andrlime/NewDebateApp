import React, { ReactNode } from 'react';
import { Divider, Paper } from '@mantine/core';

interface IInboxView {
  leftComponent: ReactNode;
  rightComponent: ReactNode;
}

const InboxView: React.FC<IInboxView> = ({ leftComponent, rightComponent }) => {
    return (
      <Paper style={{ display: 'flex', width: '100%', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ margin: '10px', width: "30%", boxSizing: 'border-box' }}>
            {leftComponent}
        </div>
        <Divider orientation="vertical" color='#EEEEEE' />
        <div style={{ margin: '10px', boxSizing: 'border-box' }}>
            {rightComponent}
        </div>
      </Paper>
    );
};

export default InboxView;
