import { useContext, useEffect, useState } from 'react';
import { IOConnectContext } from '@interopio/react-hooks';

const App = () => {
  const io = useContext(IOConnectContext);

  window.io = io;

  const [handlers, setHandlers] = useState([]);

  const setTheme = async () => {
    const theme = await io.themes?.getCurrent();

    if (!theme) return;

    const html = document.querySelector('html');

    html.classList.add(theme.name);
  };

  const setWindowBounds = async () => {
    const html = document.querySelector('html');
    const height = html.getBoundingClientRect().height;

    if (height > 800) {
      return;
    }

    const myWin = io.windows.my();

    if (window.iobrowser) {
      return myWin.moveResize({ height: height + 100, width: 400 });
    }

    return myWin.resizeTo(undefined, height + 50);
  };

  const subscribeOnHandlerAdded = () => {
    return io.intents.resolver.onHandlerAdded((handler) => {
      setHandlers((handlers) => {
        const parsedHandler = { ...handler, id: handler.instanceId || handler.applicationName, title: handler.applicationTitle };

        return [...handlers, parsedHandler];
      })
    });
  };

  const subscribeOnHandlerRemoved = () => {
    return io.intents.resolver.onHandlerRemoved((removedHandler) => {
      setHandlers((handlers) => {
        const removedHandlerWithId = { ...removedHandler, id: removedHandler.type === "app" ? removedHandler.applicationName : removedHandler.instanceId };

        return handlers.filter(handler => handler.id !== removedHandlerWithId.id);
      });
    });
  };

  const submitHandler = async (id) => {
    const chosenHandler = handlers.find((handler) => handler.id === id);

    await io.intents.resolver.sendResponse(chosenHandler);
  };

  useEffect(() => {
    setTheme();
    subscribeOnHandlerAdded();
    subscribeOnHandlerRemoved();
  }, []);

  useEffect(() => {
    setWindowBounds();
  }, [handlers]);

  return (
    <div className='container-fluid'>
      {!io && (
        <div className='tick42-loader active'>
          <div className='tick42-loader-text'>Loading ...</div>
        </div>
      )}

      <div className='row mt-3' style={{ cursor: "default" }}>
        <div className='col'>
          <h3 style={{ margin: 0 }}>Choose an app to {typeof io.intents.resolver.intent === "object" ? io.intents.resolver.intent.intent : io.intents.resolver.intent}</h3>
        </div>
      </div>

      {
        !!handlers.filter((handler) => !handler.instanceId).length && (
          <>
            <div className='row mt-3'>
              <div className='col'>
                <h5>Start new:</h5>
              </div>
            </div>

            <ul className='list-group'>
              {handlers
                .filter((handler) => !handler.instanceId)
                .map((handler) => (
                  <li
                    className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                    key={handler.id}
                    onClick={() => submitHandler(handler.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <span>
                      {handler.applicationIcon ? (
                        <img
                          src={'data:image/png;base64, ' + handler.applicationIcon}
                          alt=''
                          style={{ width: 16 }}
                          className='mr-3'
                        ></img>
                      ) : (
                        <i className='icon-app mr-3'></i>
                      )}
                      {handler.title || handler.applicationName}
                    </span>
                    <span className={`badge badge-info badge-pill`}>app</span>
                  </li>
                ))}
            </ul>
          </>
        )
      }

      {
        !!handlers.filter((handler) => handler.instanceId).length && (
          <>
            <div className='row mt-3'>
              <div className='col'>
                <h5>Use already running:</h5>
              </div>
            </div>

            <ul className='list-group'>
              {handlers
                .filter((handler) => handler.instanceId)
                .map((handler) => (
                  <li
                    className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                    key={handler.id}
                    onClick={() => submitHandler(handler.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <span>
                      {handler.applicationIcon ? (
                        <img
                          src={'data:image/png;base64, ' + handler.applicationIcon}
                          alt=''
                          style={{ width: 16 }}
                          className='mr-3'
                        ></img>
                      ) : (
                        <i className='icon-app mr-3'></i>
                      )}
                      {handler.title || handler.applicationName}
                    </span>
                    <span className={`badge badge-secondary badge-pill`}>inst</span>
                  </li>
                ))}
            </ul>
          </>
        )
      }
    </div >
  );
};

export default App;