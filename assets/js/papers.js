/* =============================================================================
   CONTENT — 全站文字内容都在这个文件里，改这里就等于改网站。
   -----------------------------------------------------------------------------
   字段说明:
     id         唯一标识（也用于 URL hash，如 #supir）
     name       缩写名，时间线上显示
     era        'super' | 'hyper' | 'master'  → 决定配色与所属阶段
     year       时间线下方的年份
     venue      会议名
     status     'published' | 'accepted' | 'submission'
     title      论文全名
     tagline    一句话主张（详情页大字）
     preview    悬停气泡里的短句
     abstract   2-4 句摘要
     highlights 3-4 条要点
     stats      右侧的关键数字/事实卡片
     step       "在这条演化线上，它往前推了哪一步"
     authors    作者列表
     links      按钮链接（href 为 '#' 的都还需要你填）
     figure     首页详情面板里的 teaser 图，如 'assets/figures/supir.jpg'
     bibtex     引用（留空则不显示 Cite 按钮）

   ---- 下面这些只出现在 papers/<id>.html 独立页面上，没有就不渲染该版块 ----
     anim       {src,title,note} 嵌入的动画演示（assets/anim/ 下）
     facts      「At a glance」数字条，[{k,v}]
     methodTitle / method   「关键思想」版块，[{t,s}]
     results    [{claim,evidence}]
     resources  [{label,href,note}] 资源卡片
     teaser     {src,alt,caption} 页面顶部大图

   前三篇的标题/作者/会议/链接已按公开信息核对（jasongt.com、xpixel.group、arXiv）。
   ⚠️ TODO: 标记 needsReview: true 的三篇尚未发表，正文是占位文案，请替换。
   ========================================================================== */

window.PAPERS = [
  {
    id: 'supir',
    name: 'SUPIR',
    era: 'super',
    year: '2024',
    venue: 'CVPR 2024',
    status: 'published',
    title: 'Scaling Up to Excellence: Practicing Model Scaling for Photo-Realistic Image Restoration In the Wild',
    tagline: 'Scale the generative prior to 2.6B, and restoration finally works in the wild.',
    preview: 'An SDXL-scale generative prior for restoration — and the first time a text prompt steers the result.',
    abstract:
      'SUPIR asks how far image restoration can go once the generative prior is scaled up. ' +
      'It builds on SDXL, a 2.6B-parameter diffusion model, trained with 20 million high-quality images ' +
      'carrying descriptive text annotations, to restore genuinely degraded photographs in the wild. ' +
      'Restoration-guided sampling and negative-quality prompts hold the result to the input while ' +
      'the generative capacity stays intact.',
    highlights: [
      'A 2.6B diffusion prior plus a lightweight adaptor — model scaling, brought to restoration',
      '20M image–text pairs, so the semantic prior can actually be awakened',
      'Textual prompt control: describe the detail you want back',
      'Restoration-guided sampling and negative-quality prompts to curb generative drift'
    ],
    stats: [
      { k: 'Prior', v: '2.6B diffusion' },
      { k: 'Data', v: '20M image–text' },
      { k: 'Control', v: 'Text prompt' }
    ],
    facts: [
      { k: 'Generative prior', v: 'SDXL · 2.6B UNet' },
      { k: 'Training data', v: '20M image–text' },
      { k: 'Compute', v: '64 GPUs · 10 days' },
      { k: 'Sampler', v: 'EDM · 50 steps' },
      { k: 'Released weights', v: 'v0Q / v0F · 5.33 GB' }
    ],
    /* 图片直接引用你们自己的项目页（supir.xpixel.group），上线前可以下载到 assets/figures/ */
    gallery: {
      title: 'Before and after',
      note: 'Four of the nine cases from the project page. Drag the handle, or focus a pair and use the arrow keys.',
      beforeLabel: 'Input',
      afterLabel: 'SUPIR',
      credit: 'Comparisons from the SUPIR project page.',
      /* 有 widths 时，before/after 写成不带尺寸后缀的前缀，渲染器会自动拼出 srcset */
      widths: [500, 800, 1024],
      ext: '.png',
      sizes: '(max-width:900px) 92vw, 44vw',
      items: [
        { label: 'General restoration', before: 'https://supir.xpixel.group/SUPIR-assets/comparison/19_LQ', after: 'https://supir.xpixel.group/SUPIR-assets/comparison/19_HQ' },
        { label: 'Landscape', before: 'https://supir.xpixel.group/SUPIR-assets/comparison/4_LQ', after: 'https://supir.xpixel.group/SUPIR-assets/comparison/4_HQ' },
        { label: 'Ultra-resolution for faces', before: 'https://supir.xpixel.group/SUPIR-assets/comparison/face_LQ', after: 'https://supir.xpixel.group/SUPIR-assets/comparison/face_HQ' },
        { label: 'Animals', before: 'https://supir.xpixel.group/SUPIR-assets/comparison/03_LQ', after: 'https://supir.xpixel.group/SUPIR-assets/comparison/03_HQ' }
      ]
    },
    results: [
      { claim: 'Model scaling is what the paper credits, not a new restoration objective.',
        evidence: 'The abstract argues that scaling the model dramatically enhances its capabilities and opens new potential for image restoration in the wild.' },
      { claim: 'Restoration can be steered by text rather than fixed by a degradation model.',
        evidence: 'The paper reports a novel capacity to manipulate restoration through textual prompts; the released CLI exposes both a positive and a negative prompt.' },
      { claim: 'The quality / fidelity trade-off is an exposed control, not a fixed property.',
        evidence: 'The repository ships two presets — quality-oriented (s_cfg 6.0, spt_linear_CFG 3.0) and fidelity-oriented (s_cfg 4.0, spt_linear_CFG 1.0).' },
      { claim: 'Two checkpoints cover different degradation regimes.',
        evidence: 'SUPIR-v0Q uses the paper’s default training settings for generalisation; SUPIR-v0F is trained on light degradation and its stage-one encoder retains more detail.' },
      { claim: 'The release has been adopted well beyond the original repository.',
        evidence: 'The official repository and the community ComfyUI port are both widely used, and pruned and mirrored weights circulate on Hugging Face.' }
    ],
    anim: {
      src: 'assets/anim/supir.html',
      title: 'SUPIR Restoration Workflow',
      note: 'A large diffusion prior steered by a trimmed adaptor, told what it is looking at by a multimodal LLM, and held to the input by restoration-guided sampling.'
    },
    methodTitle: 'The ideas doing the work',
    method: [
      { t: 'Scale the prior, trim the adaptor',
        s: 'Sampling starts from pure noise inside a frozen, pretrained SDXL — the largest prior this pipeline could be scaled to. What steers it is a ControlNet with half the ViT blocks trimmed out of the trainable copy, wired in through ZeroSFT modules rather than plain zero convolutions, so the low-quality latent can control generation at the pixel level.' },
      { t: 'Tell the model what it is looking at',
        s: 'A plain VAE encoder reads artifacts as content, so the encoder is first made robust to degradation. The latent is then decoded back to pixels and handed to a multimodal language model — LLaVA v1.5 13B in the released code — which describes what is actually in the image. That description becomes the prompt, and it is also where a person can step in and say what a blurred region should be.' },
      { t: 'Hold the generation to the input',
        s: 'At every sampling step the prediction is pulled back toward the low-quality latent with weight k_t = (σ_t / σ_T)^τ. Early on, while structure is being decided, the pull is strong; later, while texture is being drawn, it fades away. Fidelity and imagination are traded along the schedule rather than fought over globally.' },
      { t: 'Push it away from bad quality',
        s: 'Two predictions are made at each step, one on the positive prompt and one on a fixed negative-quality prompt, and classifier-free guidance pushes the result away from the second. 100K negative-quality images were added to the training set so the model actually learns the concept it is being told to avoid.' },
      { t: 'Ship the trade-off as a control',
        s: 'Two checkpoints are released: v0Q, trained with the paper’s default settings for generalisation, and v0F, trained on light degradation, whose first-stage encoder keeps more of the original detail. On top of that the repository documents a quality-oriented and a fidelity-oriented parameter preset, so the balance between invention and faithfulness is a dial the user turns rather than a property baked into the weights.' }
    ],
    step:
      'The starting point. It set the route — a scaled generative prior, made controllable — and ' +
      'exposed the bill that comes with it: slow sampling, and fidelity that needs extra machinery to defend.',
    authors:
      'Fanghua Yu*, Jinjin Gu*, Zheyuan Li, Jinfan Hu, Xiangtao Kong, Xintao Wang, ' +
      'Jingwen He, Yu Qiao, Chao Dong  (* equal contribution)',
    links: [
      { label: 'Paper', href: 'https://arxiv.org/abs/2401.13627' },
      { label: 'Project', href: 'https://supir.xpixel.group/' },
      { label: 'Code', href: 'https://github.com/Fanghua-Yu/SUPIR' }
    ],
    resources: [
      { label: 'Paper', href: 'https://arxiv.org/abs/2401.13627', note: 'arXiv 2401.13627 (v2) · CVPR 2024' },
      { label: 'Project page', href: 'https://supir.xpixel.group/', note: 'Nine before/after cases' },
      { label: 'Code', href: 'https://github.com/Fanghua-Yu/SUPIR', note: 'Inference CLI, Gradio demo, checkpoints. Non-commercial licence' },
      { label: 'Online demo', href: 'https://supir.suppixel.ai/home', note: 'SupPixel AI — the hosted application' },
      { label: 'ComfyUI nodes', href: 'https://github.com/kijai/ComfyUI-SUPIR', note: 'The community integration, third party' },
      { label: 'Hugging Face', href: 'https://huggingface.co/papers/2401.13627', note: 'Paper page' }
    ],
    figure: '',
    bibtex: `@inproceedings{yu2024supir,
  title     = {Scaling Up to Excellence: Practicing Model Scaling for
               Photo-Realistic Image Restoration In the Wild},
  author    = {Yu, Fanghua and Gu, Jinjin and Li, Zheyuan and Hu, Jinfan and
               Kong, Xiangtao and Wang, Xintao and He, Jingwen and Qiao, Yu and
               Dong, Chao},
  booktitle = {CVPR},
  year      = {2024}
}`
  },

  {
    id: 'unicon',
    name: 'UniCon',
    era: 'super',
    year: '2025',
    venue: 'ICLR 2025',
    status: 'published',
    title: 'UniCon: Unidirectional Information Flow for Effective Control of Large-Scale Diffusion Models',
    tagline: 'Make the control signal flow one way, and controllability stops costing double.',
    preview: 'One-way flow from the diffusion network to the adapter — a third less memory, 2.3× faster training.',
    abstract:
      'Mainstream control schemes couple backbone and adapter in both directions: the diffusion ' +
      'network has to process control features, and the price grows with model scale. UniCon makes ' +
      'the flow unidirectional — from the diffusion network into the adapter, which alone produces ' +
      'the output — so the backbone never computes or stores gradients for control. It cuts GPU ' +
      'memory by a third and trains 2.3× faster at the same adapter size, and within the same ' +
      'budget it supports adapters with twice the parameters.',
    highlights: [
      'Unidirectional flow: the backbone never has to process control features',
      'One third less GPU memory and 2.3× faster training at equal adapter size',
      'Twice the adapter parameters for the same compute budget',
      'Precise response to the control input across conditional generation tasks'
    ],
    stats: [
      { k: 'Design', v: 'One-way flow' },
      { k: 'Memory', v: '−1/3 GPU' },
      { k: 'Training', v: '2.3× faster' }
    ],
    facts: [
      { k: 'GPU memory', v: 'One third less' },
      { k: 'Training speed', v: '2.3× faster' },
      { k: 'Adapter capacity', v: '2× a ControlNet' },
      { k: 'Backbones tested', v: 'PixArt-α and SD 2.1' },
      { k: 'Training', v: '2M LAION · 100K steps' }
    ],
    results: [
      { claim: 'Control accuracy improves on every condition tested, on both backbones.',
        evidence: 'On PixArt-α against ControlNet: Canny SSIM 0.4748 → 0.5458, pose mAP 0.4135 → 0.4627, 4× super-resolution PSNR 34.82 → 37.34. Five conditions were evaluated — Canny, depth, OpenPose, 4× downsampling, and blur followed by 4× downsampling.' },
      { claim: 'Image quality improves alongside control rather than against it.',
        evidence: 'FID falls on every task: Canny 51.52 → 46.71, depth 53.63 → 51.49, pose 58.62 → 57.85, super-resolution 26.43 → 20.34.' },
      { claim: 'The margin is widest on low-level, high-precision conditions — where encoder-only adapters struggle.',
        evidence: 'The largest gain in the table is 4× super-resolution: FID 26.43 → 20.34 and PSNR 34.82 → 37.34. A half-size adapter already beats ControlNet there (PSNR 35.64, FID 22.07).' },
      { claim: 'The one-way flow is what does it, not the extra capacity.',
        evidence: 'With the architecture and initialisation held fixed and only the unidirectional flow switched off, Canny SSIM drops 0.5458 → 0.5053 and FID rises 46.71 → 50.17.' },
      { claim: 'ZeroFT is the best of the three connectors tried.',
        evidence: 'On Canny, against a zero-initialised MLP and shared attention: SSIM 0.5426 vs 0.5343 and 0.5236, FID 52.31 vs 55.22 and 56.22.' },
      { claim: 'The efficiency numbers are two different measurements, and both hold.',
        evidence: 'The abstract reports a third less GPU memory and 2.3× faster training at equal adapter size. The body measures the parts: nearly half the storage for gradients is saved, and backward-propagation time is nearly halved — timed over 100 batches of 16 on a single RTX A6000 in BFloat16, with no acceleration libraries.' },
      { claim: '100,000 steps is the cost-effective operating point.',
        evidence: 'Trained at 50K, 100K, 200K and 400K steps: it fails to converge at 50K, gains substantially up to 100K, and only marginally beyond.' }
    ],
    anim: {
      src: 'assets/anim/unicon.html',
      title: 'UniCon Information Flow',
      note: 'Send the information one way, from the diffusion model into the adapter, and let the adapter produce the output. The diffusion model then never needs a backward pass.'
    },
    methodTitle: 'Four ideas doing the work',
    method: [
      { t: 'The hidden cost of two-way control',
        s: 'A control adapter is a trainable copy of the frozen block stack. ControlNet adds its residuals back into those frozen blocks, so the output still leaves through the diffusion model. Because the adapter only reaches the output that way, the backward pass has to run through the frozen blocks too, and their gradients get computed and stored — roughly 16GB on top of the adapter’s own 18GB in the authors’ setup.' },
      { t: 'Turn the flow around',
        s: 'UniCon keeps the same frozen stack and the same trainable copy beside it, and changes only which way information travels. The intermediate features of the diffusion model are read out and passed into the adapter; nothing is written back. The output now leaves the adapter itself, and the whole path runs in one direction.' },
      { t: 'The ZeroFT connector',
        s: 'The connector is more than an addition. It applies a scale and a shift, both produced by layers initialised at zero, plus a shortcut — so training begins from the untouched model and grows its influence from there.' },
      { t: 'What the one-way design buys',
        s: 'Only the adapter needs gradients. The diffusion model runs forward and is never touched, so its generative ability cannot be forgotten either. A third less memory, 2.3× faster training, and room for an adapter twice the size of a ControlNet at the same cost — and it drops straight onto a transformer backbone, where encoder and decoder cannot be cleanly separated.' }
    ],
    step:
      'It removes the structural cost SUPIR left behind: controllable and large-scale stop being a trade-off. ' +
      'The paper closes the loop by putting UniCon on SD3 inside the SUPIR framework — shown qualitatively.',
    authors: 'Fanghua Yu, Jinjin Gu, Jinfan Hu, Zheyuan Li, Chao Dong',
    links: [
      { label: 'Paper', href: 'https://arxiv.org/abs/2503.17221' },
      { label: 'OpenReview', href: 'https://openreview.net/forum?id=uJqKf24HGN' }
    ],
    resources: [
      { label: 'Paper', href: 'https://arxiv.org/abs/2503.17221', note: 'arXiv 2503.17221 (v2) · ICLR 2025' },
      { label: 'Full text', href: 'https://arxiv.org/html/2503.17221v2', note: 'HTML, including the appendix' },
      { label: 'ICLR proceedings', href: 'https://proceedings.iclr.cc/paper_files/paper/2025/file/ba1293b663ddd4a29c6854e4d3bf766a-Paper-Conference.pdf', note: 'Camera-ready PDF' },
      { label: 'OpenReview', href: 'https://openreview.net/forum?id=uJqKf24HGN', note: 'Reviews and rebuttal' }
    ],
    figure: '',
    bibtex: `@inproceedings{yu2025unicon,
  title     = {UniCon: Unidirectional Information Flow for Effective Control of
               Large-Scale Diffusion Models},
  author    = {Yu, Fanghua and Gu, Jinjin and Hu, Jinfan and Li, Zheyuan and
               Dong, Chao},
  booktitle = {ICLR},
  year      = {2025}
}`
  },

  {
    id: 'hypir',
    name: 'HYPIR',
    era: 'hyper',
    year: '2025',
    venue: 'SIGGRAPH Asia 2025',
    status: 'published',
    title: 'Harnessing Diffusion-Yielded Score Priors for Image Restoration',
    tagline: 'Stop sampling. Initialise from a diffusion prior and restore in a single forward pass.',
    preview: 'The diffusion prior only initialises; adversarial fine-tuning does the rest — one step, and steadier.',
    abstract:
      'MSE-based, GAN-based and diffusion-based restoration each fail to balance quality, fidelity ' +
      'and speed. HYPIR’s pipeline is deliberately plain: initialise the restoration model from a ' +
      'pre-trained diffusion model, then fine-tune it with adversarial training — no diffusion loss, ' +
      'no iterative sampling, no extra adapters. The paper shows theoretically that this ' +
      'initialisation starts very close to the natural image distribution, which improves numerical ' +
      'stability, avoids mode collapse, and substantially accelerates convergence.',
    highlights: [
      'The diffusion prior initialises rather than samples: one forward pass at inference',
      'Pure adversarial fine-tuning — no diffusion loss, no distillation, no adapters',
      'Provably starts near the natural image distribution: stable, no mode collapse, fast to converge',
      'Inherits diffusion-style control: text-guided restoration and adjustable texture richness'
    ],
    stats: [
      { k: 'Inference', v: '1 forward pass' },
      { k: 'Training', v: 'Adversarial only' },
      { k: 'Control', v: 'Text + texture' }
    ],
    facts: [
      { k: 'Inference', v: 'One forward pass' },
      { k: 'Open release', v: 'Stable Diffusion 2.1' },
      { k: 'Adapter', v: 'LoRA · rank 256' },
      { k: 'Weights', v: '1.04 GB' },
      { k: 'Runs on', v: 'A free Colab T4' }
    ],
    results: [
      { claim: 'The paper reports that HYPIR outperforms previous state-of-the-art restoration methods.',
        evidence: 'This is the abstract’s own claim; the comparison tables are in the paper, not on the public pages, so read it there.' },
      { claim: 'It scales to very large outputs, by tiling.',
        evidence: 'The project page’s ultra-high-resolution case takes a 994 × 720 input to 7952 × 5760 — eight times on each axis. Above the tile size the model is applied per tile (512 px patches, stride 256); there is still no sampling loop inside a tile.' },
      { claim: 'The same input restores differently depending on the prompt.',
        evidence: 'The project page shows one input restored under two prompts, “rock covered with ice and snow” and a seaside reading.' },
      { claim: 'Texture richness and the generation / fidelity balance are adjustable at inference.',
        evidence: 'Two separate capability sections on the project page pair one input with results at different settings.' },
      { claim: 'The released model is small enough to run on commodity hardware.',
        evidence: 'The repository states a free Colab T4 is sufficient; the hosted Replicate deployment also runs on a T4.' },
      { claim: 'The open release is deliberately not the strongest model.',
        evidence: 'The repository notes that the open-source version is based on SD 2.1 with a small parameter count, and that the team’s most advanced model is served elsewhere.' }
    ],
    /* HYPIR 项目页上的对比图多为电影截帧（Avatar / Matrix / LOTR 等），版权上不适合搬到这里。
       想加 before/after 的话，换成你们自己有权使用的素材，格式照 supir 的 gallery 写。 */
    anim: {
      src: 'assets/anim/hypir.html',
      title: 'HYPIR Training Pipeline',
      note: 'A pretrained diffusion model supplies the initialisation, then lightweight adversarial fine-tuning does the rest. No diffusion loss, no sampling loop, no control adapters.'
    },
    methodTitle: 'Four ideas doing the work',
    method: [
      { t: 'Initialise, do not sample',
        s: 'A pretrained latent diffusion network already encodes the score of the natural image distribution — the quickest route from a degraded image back to clean data. HYPIR inherits those weights as the initialisation of its Restore Network. That single choice is what the whole method rests on.' },
      { t: 'Strip the degradation first',
        s: 'The VAE encoder is not robust to heavy degradation, so stage one fine-tunes it into a degradation-removal encoder, supervised through the frozen decoder. The parts then assemble into a plain image-to-image model: encode once, run the network once, decode once.' },
      { t: 'Adversarial fine-tuning, nothing else',
        s: 'A discriminator learns to separate restored images from clean ones, while MSE and LPIPS hold the output to the content of the input. Both signals flow back into the Restore Network alone — the degradation-removal encoder and the VAE decoder stay frozen, and in practice the update is a LoRA.' },
      { t: 'Why it converges',
        s: 'Because the initialisation already sits within a small Wasserstein distance of the data distribution, the adversarial gradients start small, the modes are already covered, and training converges in tens of thousands of steps. At test time a single forward pass produces the result, which is where the order-of-magnitude speedup over diffusion sampling comes from.' }
    ],
    step:
      'Where the HYPER phase begins: the generative prior is freed from the sampling loop, and speed ' +
      'stops being the price of generative restoration.',
    authors: 'Xinqi Lin, Fanghua Yu, Jinfan Hu, Zhiyuan You, Wu Shi, Jimmy S. Ren, Jinjin Gu, Chao Dong',
    links: [
      { label: 'Paper', href: 'https://arxiv.org/abs/2507.20590' },
      { label: 'Project', href: 'https://hypir.xpixel.group/' },
      { label: 'Code', href: 'https://github.com/XPixelGroup/HYPIR' }
    ],
    resources: [
      { label: 'Paper', href: 'https://arxiv.org/abs/2507.20590', note: 'arXiv 2507.20590 · SIGGRAPH Asia 2025 (TOG)' },
      { label: 'Project page', href: 'https://hypir.xpixel.group/', note: 'Six capability demos and a walkthrough video' },
      { label: 'Code', href: 'https://github.com/XPixelGroup/HYPIR', note: 'Training and inference. Non-commercial licence' },
      { label: 'Model weights', href: 'https://huggingface.co/lxq007/HYPIR/tree/main', note: 'HYPIR-SD2 LoRA, discriminator and encoder' },
      { label: 'Hosted demo', href: 'https://replicate.com/0x3f3f3f3fun/hypir-sd2', note: 'Runs HYPIR-SD2 on a T4' },
      { label: 'Video walkthrough', href: 'https://www.youtube.com/watch?v=M-E1kr0fgZk', note: 'Also on Bilibili' },
      { label: 'ComfyUI nodes', href: 'https://github.com/EricRollei/HYPIR-ComfyUI', note: 'Community integration, third party' },
      { label: '中文项目页', href: 'https://hypirzh.xpixel.group/', note: 'Chinese mirror of the project page' }
    ],
    figure: '',
    bibtex: `@article{lin2025hypir,
  title   = {Harnessing Diffusion-Yielded Score Priors for Image Restoration},
  author  = {Lin, Xinqi and Yu, Fanghua and Hu, Jinfan and You, Zhiyuan and
             Shi, Wu and Ren, Jimmy S. and Gu, Jinjin and Dong, Chao},
  journal = {ACM Transactions on Graphics (SIGGRAPH Asia)},
  year    = {2025}
}`
  },

  {
    id: 'hypi2vr',
    name: 'HYPI2VR',
    era: 'hyper',
    year: '2026',
    venue: 'NeurIPS 2026',
    status: 'accepted',
    needsReview: true,          /* ⚠️ 只剩 links（arXiv / 项目页 / 代码）还空着 */
    title: 'Harnessing Image Diffusion Priors for Video Restoration',
    tagline: 'Carry single-pass generative restoration into video, by controlling the noise.',
    preview: 'The image model runs per frame; the stochasticity is rebalanced and warped so texture stops flickering.',
    abstract:
      'HYPI2VR carries a single-pass image restoration model, built on a pretrained image diffusion ' +
      'prior, into video. The hard part is not per-frame quality but the stochasticity that generative ' +
      'restoration depends on: sampled independently per frame, synthesized texture flickers. HYPI2VR ' +
      'rebalances the injected noise in frequency, warps it along optical flow so it travels with the ' +
      'content, removes the encoder’s own frame-dependent perturbation by noise-to-noise training, and ' +
      'links frames directly with temporal attention.',
    highlights: [
      'Noise energy rebalancing: a high-pass mask keeps stochasticity where detail lives',
      'Motion-aligned noise: optical flow carries the noise pattern from frame to frame',
      'Noise-to-noise encoder training, with no clean latent needed as supervision',
      'Temporal attention after each spatial block, for the motion and occlusion flow cannot cover'
    ],
    stats: [
      { k: 'Domain', v: 'Image prior → video' },
      { k: 'Backbone', v: 'HYPIR-style, per frame' },
      { k: 'Status', v: 'To appear' }
    ],
    facts: [
      { k: 'Prior', v: 'Image diffusion' },
      { k: 'Per frame', v: 'Encode · restore · decode' },
      { k: 'Noise', v: 'High-pass + flow-warped' },
      { k: 'Temporal', v: 'Per-block attention' },
      { k: 'Encoder loss', v: 'ℒ_mse + 0.05 ℒ_flow' }
    ],
    anim: {
      src: 'assets/anim/hypi2vr.html',
      title: 'HYPI2VR Restoration Pipeline',
      note: 'Carrying an image diffusion prior into video: how the injected noise is rebalanced in frequency, warped along motion, and tied across frames.'
    },
    methodTitle: 'Four ideas doing the work',
    method: [
      { t: 'The backbone is the image model',
        s: 'HYPI2VR starts from an image restoration model built on a pretrained image diffusion prior: a degradation-removal encoder, a latent restoration network, and the frozen VAE decoder. Every low-quality frame runs through that same backbone — encoded, restored in latent space, decoded back to pixels.' },
      { t: 'Rebalance the injected noise',
        s: 'Stochastic noise injected into the latent is what lets the network synthesize detail the input never carried. A high-pass mask keeps that stochasticity in the high frequencies and suppresses the low-frequency part, which is the part that pulls the result away from the structure of the input.' },
      { t: 'Warp the noise along motion',
        s: 'Left alone, frame two would draw its own independent noise and the synthesized textures would flicker. Optical flow warps the rebalanced noise from one frame onto the next, so a moving region keeps its stochastic pattern instead of sampling a new one, and detail travels with the content rather than against it.' },
      { t: 'Clean the encoder, then link the frames',
        s: 'The encoder adds a frame-dependent perturbation of its own; training it against flow-aligned neighbouring latents removes that, with no clean latent needed as supervision. A temporal attention block after each spatial block then links frames directly, covering the motion and occlusion that flow-based propagation cannot.' }
    ],
    step: 'A step across dimensions: the object of restoration goes from a frame to a stretch of time.',
    authors: 'Fanghua Yu, Hongyu An, Jinfan Hu, Xinqi Lin, Zhiyuan You, Hongyang Li, ' +
      'Chao Dong, Jinjin Gu  (corresponding author)',
    links: [{ label: 'Paper', href: '#' }],
    resources: [],
    figure: '',
    bibtex: `@inproceedings{yu2026hypi2vr,
  title     = {Harnessing Image Diffusion Priors for Video Restoration},
  author    = {Yu, Fanghua and An, Hongyu and Hu, Jinfan and Lin, Xinqi and
               You, Zhiyuan and Li, Hongyang and Dong, Chao and Gu, Jinjin},
  booktitle = {NeurIPS},
  year      = {2026}
}`
  },

  {
    id: 'hypvr',
    name: 'HYPVR',
    era: 'hyper',
    year: '',
    venue: 'Coming soon',         /* 未发表的一律只写这个，不写会议名也不写 in submission */
    status: 'submission',
    needsReview: true,          /* 标题与作者待填；方法内容取自你自己的动画解说，是真实的 */

    /* ⚠️⚠️ 论文还没放出去，所以整页先只显示「Not out yet」卡片。
       下面的 facts / anim / method / highlights / stats 一个字都没删，
       **只要把这个 soon 块整段删掉，完整页面立刻全部回来**，不需要改别的。 */
    soon: {
      label: 'Coming soon',
      title: 'Not out yet.',
      text: 'The full write-up, the results and an animated walkthrough will appear on ' +
            'this page once the work is out.',
      meta: ''
    },

    title: '',                  /* ⚠️ 论文全名还没公开：填了这里页面就会显示副标题 */
    tagline: 'A native video prior, and temporal realism learned by matching its distribution.',
    preview: 'The generator starts as a copy of a video diffusion model, then a teacher score teaches it time.',
    abstract:
      'HYPVR builds the restoration model on a native video generative prior rather than an image one. ' +
      'A pretrained video diffusion model and its video VAE supply the prior, and the video restoration ' +
      'generator starts as a copy of it. Temporal realism is supervised by video distribution matching ' +
      'against a frozen teacher score from the same prior, while spatial fidelity and detail come from ' +
      'losses on sampled frames — one objective, two kinds of realism.',
    highlights: [
      'A native video prior: pretrained video diffusion model plus video VAE',
      'The generator is initialised as a copy of that prior, not trained from scratch',
      'Video distribution matching carries temporal consistency the input never contained',
      'Sampled-frame adversarial and fidelity losses keep per-frame detail sharp'
    ],
    stats: [
      { k: 'Prior', v: 'Native video diffusion' },
      { k: 'Temporal', v: 'Distribution matching' },
      { k: 'Status', v: 'Coming soon' }
    ],
    facts: [
      { k: 'Prior', v: 'Video diffusion + VAE' },
      { k: 'Initialisation', v: 'Copy of the prior' },
      { k: 'Temporal branch', v: 'Teacher vs fake score' },
      { k: 'Spatial branch', v: 'GAN + MSE/LPIPS' },
      { k: 'Objective', v: 'ℒ_fid + λ_adv ℒ_adv + λ_DM ℒ_DM' }
    ],
    anim: {
      src: 'assets/anim/hypvr.html',
      title: 'HYPVR Training Loop',
      note: 'One pass through the framework: the video generative prior, the forward path, both supervision branches, and the objective they add up to.'
    },
    methodTitle: 'Four ideas doing the work',
    method: [
      { t: 'The prior is now video',
        s: 'A pretrained video diffusion model and its video VAE form the generative prior everything else is built on. The video restoration generator starts as a copy of that diffusion model, so it inherits temporal structure before it has seen a single training pair.' },
      { t: 'Teach time by matching distributions',
        s: 'The restored latent is noised again at t ∼ U([20, 400]) and read twice: once by a frozen video teacher score, once by a trainable fake score. The teacher comes from the same video prior, so this branch carries temporal knowledge the generator never sees in its own low-quality input.' },
      { t: 'Sharpen detail on single frames',
        s: 'A sampled frame is decoded back to pixels, where an image discriminator produces the adversarial term and MSE with LPIPS against the ground truth produces the fidelity term. Both gradients return through the decoder into the generator, sharpening detail inside each frame.' },
      { t: 'One objective, two kinds of realism',
        s: 'Everything sums into a single generator objective: ℒ_G = ℒ_fid + λ_adv ℒ_adv + λ_DM ℒ_DM. Spatial fidelity and realism come from single frames; temporal realism comes from the video prior.' }
    ],
    step: 'Video restoration stops being a generalisation of image methods and becomes a problem of its own.',
    authors: '',                /* ⚠️ 作者列表待填 */
    links: [],
    resources: [],
    figure: '',
    bibtex: ''
  },

  {
    id: 'mastir',
    name: 'MASTIR',
    era: 'master',
    year: '',
    venue: 'Coming soon',         /* 未发表的一律只写这个，不写会议名也不写 in submission */
    status: 'submission',
    needsReview: true,          /* 还没有公开材料，页面走 soon 状态；有内容了删掉 soon 即可 */
    title: 'MASTIR',
    tagline: 'One model, mastering restoration itself.',
    preview: 'The end of the line: restoration as one general capability. Not out yet.',
    abstract:
      'MASTIR is where this line converges. Not a model per degradation, per modality, per task, ' +
      'but restoration learned as a general capability — one understanding of damage, one way of ' +
      'calling on the prior, one interface to ask for what you want.',
    highlights: [],
    stats: [
      { k: 'Scope', v: 'Unified' },
      { k: 'Status', v: 'Coming soon' }
    ],
    facts: [],
    /* 有 soon 时，页面会渲染一张「敬请期待」卡片，代替方法 / 结果 / 动画那几个版块 */
    soon: {
      label: 'Coming soon',
      title: 'Not out yet.',
      text: 'The full write-up, the results and an animated walkthrough will appear on ' +
            'this page once the work is out.',
      meta: ''
    },
    step: 'The end of the line, and the start of another: from handling one kind of damage to mastering repair.',
    authors: '',
    links: [],
    resources: [],
    figure: '',
    bibtex: ''
  }
];

/* 三个阶段的说明（首页 Overview 卡片 + 时间线上方的分组标签） */
window.ERAS = {
  super: {
    label: 'SUPER',
    title: 'Scale',
    blurb: 'Scale the generative prior up, and make it controllable. Restoration acquires imagination.'
  },
  hyper: {
    label: 'HYPER',
    title: 'Speed',
    blurb: 'Stop sampling. The prior only initialises, one forward pass restores — then it reaches into time.'
  },
  master: {
    label: 'MASTER',
    title: 'Unification',
    blurb: 'Not a model per degradation, but restoration itself learned as a general capability.'
  }
};

/* 页脚保留的机构链接 */
window.LABS = [
  { name: 'XPixel Group', href: 'https://xpixel.group/' },
  { name: 'SIAT, CAS', href: 'https://www.siat.ac.cn/' },
  { name: 'INSAIT', href: 'https://insait.ai/' }
];

/* =============================================================================
   LOGOS — 机构 logo 条
   -----------------------------------------------------------------------------
   src   logo 文件路径，放在 assets/logos/ 下，例如 'assets/logos/insait.svg'
         优先用 SVG 或透明背景 PNG（深色/单色版最好，页面是亮色底）。
         留空 → 显示同尺寸的虚线文字牌占位，放好图会自动替换。
   h     显示高度（px）。宽标准字调小一点、方形标记调大一点，视觉重量才一致。
   ========================================================================== */
window.LOGO_PLACEMENT = 'hero';   // 'hero' | 'footer' | 'both'

window.LOGOS = [
  { name: 'INSAIT',       href: 'https://insait.ai/',      src: 'assets/logos/insait.png', h: 29 },
  { name: 'XPixel Group', href: 'https://xpixel.group/',   src: 'assets/logos/xpixel.png', h: 58 },
  { name: 'SIAT · CAS',   href: 'https://www.siat.ac.cn/', src: 'assets/logos/siat.png',   h: 46 }
];

/* =============================================================================
   RELATED WORK — 首页底部的独立版块
   -----------------------------------------------------------------------------
   以下条目全部取自 jasongt.com 与 xpixel.group 的公开发表列表，范围限定在
   图像修复 / 人脸修复 / 可解释性与泛化 / 图像质量评价（不含 inpainting、editing）。
   thumb   缩略图路径，如 'assets/figures/rw-diffbir.jpg'；留空则显示占位底纹
   tint    'super' | 'hyper' | 'master'，只影响占位底纹和悬停描边的颜色
   ========================================================================== */
/* Related Work 的四个分组：顺序就是页面上的顺序。
   motif 决定卡片自动生成的示意图母题，tint 决定配色。 */
window.RELATED_GROUPS = [
  { key: 'generative', motif: 'generative', tint: 'super',
    title: 'Generative restoration',
    note: 'Putting detail back by leaning on a generative prior — and asking how far that has actually got us.' },
  { key: 'models', motif: 'models', tint: 'hyper',
    title: 'Restoration models and benchmarks',
    note: 'Architectures, evaluation protocols, and the face-specific line of work.' },
  { key: 'interpret', motif: 'interpret', tint: 'master',
    title: 'Interpretability and generalisation',
    note: 'What these networks actually learned, and where it stops holding.' },
  { key: 'agents', motif: 'agents', tint: 'super',
    title: 'Agents and image quality',
    note: 'Systems that decide how to restore, and the measures that judge the result.' }
];

window.RELATED_PLACEHOLDER = false;

window.RELATED = [
  /* ---- generative & agentic image restoration ---- */
  {
    title: 'DiffBIR: Towards Blind Image Restoration with Generative Diffusion Prior',
    venue: 'ECCV 2024',
    authors: 'Xinqi Lin, Jingwen He, Ziyan Chen, Zhaoyang Lyu, Bo Dai, Fanghua Yu, Yu Qiao, Wanli Ouyang, Chao Dong',
    note: 'Generative IR',
    href: 'https://arxiv.org/abs/2308.15070', thumb: '', group: 'generative'
  },
  {
    title: 'How Far Have We Gone in Generative Image Restoration? A Study on Its Capability, Limitations and Evaluation Practices',
    venue: 'CVPR Findings 2026',
    authors: 'Xiang Yin, Jinfan Hu, Zhiyuan You, Kainan Yan, Yu Tang, Chao Dong, Jinjin Gu',
    note: 'Evaluation',
    href: 'https://arxiv.org/abs/2603.05010', thumb: '', group: 'generative'
  },
  {
    title: 'An Intelligent Agentic System for Complex Image Restoration Problems',
    venue: 'ICLR 2025',
    authors: 'Kaiwen Zhu, Jinjin Gu, Zhiyuan You, Yu Qiao, Chao Dong',
    note: 'Agentic IR',
    href: 'https://arxiv.org/abs/2410.17809', thumb: '', group: 'agents'
  },
  {
    title: 'RestoreAgent: Autonomous Image Restoration Agent via Multimodal Large Language Models',
    venue: 'NeurIPS 2024',
    authors: 'Haoyu Chen, Wenbo Li, Jinjin Gu, Jingjing Ren, Sixiang Chen, Tian Ye, Renjing Pei, Kaiwen Zhou, Fenglong Song, Lei Zhu',
    note: 'Agentic IR',
    href: 'https://arxiv.org/abs/2407.18035', thumb: '', group: 'agents'
  },
  {
    title: 'HAT: Hybrid Attention Transformer for Image Restoration',
    venue: 'TPAMI 2025',
    authors: 'Xiangyu Chen, Xintao Wang, Wenlong Zhang, Xiangtao Kong, Yu Qiao, Jiantao Zhou, Chao Dong',
    note: 'Architecture',
    href: 'https://arxiv.org/abs/2309.05239', thumb: '', group: 'models'
  },
  {
    title: 'SEAL: A Framework for Systematic Evaluation of Real-World Super-Resolution',
    venue: 'ICLR 2024 (spotlight)',
    authors: 'Wenlong Zhang, Xiaohui Li, Xiangyu Chen, Yu Qiao, Xiao-Ming Wu, Chao Dong',
    note: 'Evaluation',
    href: 'https://github.com/XPixelGroup/SEAL', thumb: '', group: 'models'
  },

  /* ---- face restoration ---- */
  {
    title: 'Overcoming False Illusions in Real-World Face Restoration with Multi-Modal Guided Diffusion Model',
    venue: 'ICLR 2025 (spotlight)',
    authors: 'Keda Tao, Jinjin Gu, Yulun Zhang, Xiucheng Wang, Nan Cheng',
    note: 'Face restoration',
    href: 'https://arxiv.org/abs/2410.04161', thumb: '', group: 'generative'
  },
  {
    title: 'VQFR: Blind Face Restoration with Vector-Quantized Dictionary and Parallel Decoder',
    venue: 'ECCV 2022',
    authors: 'Yuchao Gu, Xintao Wang, Liangbin Xie, Chao Dong, Gen Li, Ying Shan, Ming-Ming Cheng',
    note: 'Face restoration',
    href: 'https://github.com/TencentARC/VQFR', thumb: '', group: 'models'
  },
  {
    title: 'GCFSR: A Generative and Controllable Face Super Resolution Method Without Facial and GAN Priors',
    venue: 'CVPR 2022',
    authors: 'Jingwen He, Wu Shi, Kai Chen, Lean Fu, Chao Dong',
    note: 'Face SR',
    href: 'https://arxiv.org/abs/2203.07319', thumb: '', group: 'models'
  },

  /* ---- interpretability & generalisation ---- */
  {
    title: 'Interpreting Super-Resolution Networks with Local Attribution Maps',
    venue: 'CVPR 2021',
    authors: 'Jinjin Gu, Chao Dong',
    note: 'Interpretability',
    href: 'https://x-lowlevel-vision.github.io/lam.html', thumb: '', group: 'interpret'
  },
  {
    title: 'Interpreting Low-level Vision Models with Causal Effect Maps',
    venue: 'TPAMI 2025',
    authors: 'Jinfan Hu, Jinjin Gu, Shiyao Yu, Fanghua Yu, Zheyuan Li, Zhiyuan You, Chaochao Lu, Chao Dong',
    note: 'Interpretability',
    href: 'https://arxiv.org/abs/2407.19789', thumb: '', group: 'interpret'
  },
  {
    title: 'Finding Discriminative Filters for Specific Degradations in Blind Super-Resolution',
    venue: 'NeurIPS 2021 (spotlight)',
    authors: 'Liangbin Xie, Xintao Wang, Chao Dong, Zhongang Qi, Ying Shan',
    note: 'Interpretability',
    href: 'https://github.com/TencentARC/FAIG', thumb: '', group: 'interpret'
  },
  {
    title: 'Networks Are Slacking Off: Understanding Generalization Problem in Image Deraining',
    venue: 'NeurIPS 2023',
    authors: 'Jinjin Gu, Xianzheng Ma, Xiangtao Kong, Yu Qiao, Chao Dong',
    note: 'Generalisation',
    href: 'https://arxiv.org/abs/2305.15134', thumb: '', group: 'interpret'
  },
  {
    title: 'Evaluating the Generalization Ability of Super-Resolution Networks',
    venue: 'TPAMI 2023',
    authors: 'Yihao Liu, Hengyuan Zhao, Jinjin Gu, Yu Qiao, Chao Dong',
    note: 'Generalisation',
    href: 'https://arxiv.org/abs/2205.07019', thumb: '', group: 'interpret'
  },

  /* ---- image quality assessment ---- */
  {
    title: 'PIPAL: A Large-Scale Image Quality Assessment Dataset for Perceptual Image Restoration',
    venue: 'ECCV 2020',
    authors: 'Jinjin Gu, Haoming Cai, Haoyu Chen, Xiaoxing Ye, Jimmy S. Ren, Chao Dong',
    note: 'IQA dataset',
    href: 'https://link.springer.com/chapter/10.1007/978-3-030-58621-8_37', thumb: '', group: 'agents'
  },
  {
    title: 'Depicting Beyond Scores: Advancing Image Quality Assessment through Multi-modal Language Models',
    venue: 'ECCV 2024',
    authors: 'Zhiyuan You, Zheyuan Li, Jinjin Gu, Zhenfei Yin, Tianfan Xue, Chao Dong',
    note: 'Descriptive IQA',
    href: 'https://arxiv.org/abs/2312.08962', thumb: '', group: 'agents'
  },
  {
    title: 'Enhancing Descriptive Image Quality Assessment with a Large-scale Multi-modal Dataset',
    venue: 'TIP 2025',
    authors: 'Zhiyuan You, Jinjin Gu, Xin Cai, Zheyuan Li, Kaiwen Zhu, Chao Dong, Tianfan Xue',
    note: 'Descriptive IQA',
    href: 'https://arxiv.org/abs/2405.18842', thumb: '', group: 'agents'
  },
  {
    title: 'Teaching Large Language Models to Regress Accurate Image Quality Scores using Score Distribution',
    venue: 'CVPR 2025',
    authors: 'Zhiyuan You, Xin Cai, Jinjin Gu, Tianfan Xue, Chao Dong',
    note: 'IQA',
    href: 'https://depictqa.github.io/deqa-score/', thumb: '', group: 'agents'
  }
];
