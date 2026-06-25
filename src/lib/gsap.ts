import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { TextPlugin } from 'gsap/TextPlugin'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin, Flip)

export { ScrollTrigger, ScrollToPlugin, TextPlugin, Flip }
export default gsap
