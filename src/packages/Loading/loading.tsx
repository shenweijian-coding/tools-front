import { defineComponent, ref } from "vue";
import "./index.less";

export default defineComponent({
  name: "HayLoading",
  setup() {
    const title = ref("");
    const setTitle = (newTitle: string) => {
      title.value = newTitle;
    };

    return { title, setTitle };
  },
  render() {
    return <div class="hay-loading-mask">
      <div class="hay-loading-spinner">
        <i class="hay-icon-loading"></i>
        <p class="hay-loading-text">拼命加载中！</p>
      </div>
    </div>;
  },
});
