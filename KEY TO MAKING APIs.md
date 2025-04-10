import { generateClient } from "aws-amplify/data";
// @ts-ignore
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react'; //useAuthenticator,



const client = generateClient<Schema>();





  const user = useAuthenticator();



const [itemData, setItemData] = useState([]);

useEffect(() => {

  console.log("Ts pmo icl: ", client.models.Object)

  const createObj = {};

  /*
  client.models.User.get({ id: user.user.userId }).then((userData) => {
    //console.log("Word", userData)
    console.log('test: ', userData.data);
    if (!(userData.data)) {
      client.models.User.create(createObj).then(() => {});
    }
  })
  */
}, []);
