import logo from './logo.svg';
import './App.css';

import LitJsSdk from "lit-js-sdk";

const code = `
const go = async () => {

  /* wat representation:
  (module 
    (type $0 (func (param i32 i32) (result i32)))
    (memory $0 0)
    (export "add" (func $0))
    (func $0 (type $0) (param $var$0 i32) (param $var$1 i32) (result i32) 
      (i32.add
      (get_local $var$0)
      (get_local $var$1)
      )
    )
  )
  */
  var source = new Uint8Array([
      0, 97, 115, 109, 1,   0, 0,  0,  1,   7,   1,
     96,  2, 127, 127, 1, 127, 3,  2,  1,   0,   5,
      3,  1,   0,   0, 7,   7, 1,  3, 97, 100, 100,
      0,  0,  10,   9, 1,   7, 0, 32,  0,  32,   1,
    106, 11
  ]);

  var instance = (await WebAssembly.instantiate(source)).instance;
  var val = instance.exports.add(2, 2);

  LitActions.setResponse({response: JSON.stringify(val)})
};

go();
`

const runLitAction = async () => {
  // you need an AuthSig to auth with the nodes
  // this will get it from metamask or any browser wallet
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });

  const litNodeClient = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code,
    authSig,
  });
  console.log("results: ", results);
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Test WebAssembly On Lit Protocol</p>
        <button onClick={runLitAction}>Run Test, Check Console!</button>
      </header>
    </div>
  );
}

export default App;
