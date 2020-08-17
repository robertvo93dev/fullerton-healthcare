import React from 'react';

export class Page401 extends React.Component {
    render() {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 80px)',
                color: 'red'
            }
            }>
                <h2>401 Access denied</h2>
            </div >
        )
    }
}