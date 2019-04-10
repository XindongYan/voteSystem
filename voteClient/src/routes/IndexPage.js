import React from 'react';
import { connect } from 'dva';
// import styles from './IndexPage.css';
import { Layout, Breadcrumb, Menu, Card, List, Button, Icon, message } from 'antd';
// import { routerRedux } from 'dva/router';
import { like } from '../services/example';

const { Header, Content, Footer } = Layout;
const { Meta } = Card;

@connect(state => ({
  voteBackendContent: state.example.voteBackendContent
}))

export default class IndexPage extends React.PureComponent {

  componentDidMount() {

    this.props.dispatch({
      type: 'example/fetchBackend',
      payload: {}
    });
  }

  hanldSubmit = async (e) => {
    try {
      let result = await like({ id: e });
      if (result && result.data) {
        message.success('投票成功')
        this.props.dispatch({
          type: 'example/fetchBackend',
          payload: {}
        });
      }
    } catch (error) {
      // console.log(error)
      message.warn('投票频率过快请稍后再试')
    }

  }

  render() {

    const { voteBackendContent } = this.props;

    return (
      <Layout>
        {/* 头 */}
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">参与投票</Menu.Item>
          </Menu>
        </Header>

        {/* 内容  */}
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>最美校园投票</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
            <List
              grid={{
                gutter: 32, column: 6
              }}
              dataSource={voteBackendContent.data.content}
              renderItem={item => (
                <List.Item>
                  <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={`http://127.0.0.1:3000${item.imageUrl}`} />}
                  // actions={}
                  >
                    <Meta
                      title={item.name}
                      description={
                        <div style={{ textOverflow: 'elipsis' }}>
                          {item.desc}
                          <br />
                          <div style={{ textAlign: 'center', marginTop: 30 }}>
                            <Button onClick={e => this.hanldSubmit(item._id)}><Icon type="like" theme="twoTone" twoToneColor="#eb2f96" />{item.like} 投他一票</Button>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </Content>

        {/* 尾部 */}
        <Footer style={{ textAlign: 'center' }}>
          朱杰作品
        </Footer>

      </Layout>
    )
  }
}
